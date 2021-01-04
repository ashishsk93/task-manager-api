const request = require('supertest')
const app = require('../src/app')
const Tasks = require('../src/models/task')
const { userOneId, userOne, userTwo, setupDatabase, taskOne, taskTwo, taskThree } = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should create task for user', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'From My Test'
        })
        .expect(201)

    const task = await Tasks.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.complete).toBeFalsy()
})

test('Should return all tasks for a user', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
        
    expect(response.body).toHaveLength(2)
})

test('Should not delete task for user one', async () => {
    await request(app)
        .delete('/tasks/'+ taskOne._id)
        .set('Authorization',`Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)

    const task = await Tasks.findById(taskOne._id)
    expect(task).not.toBeNull()
})