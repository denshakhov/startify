import { buildApplication } from '../../../app'
import { FastifyApp } from '../../../types'
import { ITasksCreate } from '../tasks.schemas'

let fastifyApp: FastifyApp
const nonExistentUUID = '00000000-0000-0000-0000-000000000000'
const taskFixture = {
    title: 'Buy milk',
}

async function api(url: string, payload?: any) {
    return fastifyApp.inject({ method: 'POST', url, payload })
}

async function createTask(): Promise<ITasksCreate['Response']> {
    return (await api('/tasks/create', taskFixture)).json()
}

beforeAll(async () => {
    fastifyApp = await buildApplication()
})
afterAll(async () => fastifyApp.close())
afterEach(async () => fastifyApp.pg.query('TRUNCATE TABLE tasks'))

describe('/tasks/get-all', () => {
    test('Should return an empty list by default', async () => {
        const response = await api('/tasks/get-all')

        expect(response.statusCode).toBe(200)
        expect(response.json()).toHaveLength(0)
    })

    test('Should return one task after a task was created', async () => {
        await createTask()

        const response = await api('/tasks/get-all')

        expect(response.statusCode).toBe(200)
        expect(response.json()).toHaveLength(1)
    })
})

describe('/tasks/get-one', () => {
    test('Should return a task object when id is correct', async () => {
        const createdTask = await createTask()
        const getOneResponse = await api('/tasks/get-one', { id: createdTask.id })

        expect(getOneResponse.statusCode).toBe(200)
        expect(getOneResponse.json()).toEqual({
            id: expect.any(String),
            title: taskFixture.title,
            completed: false,
            created_at: expect.any(String),
        })
    })

    test('Should return 404 error when id is non existent', async () => {
        const response = await api('/tasks/get-one', { id: nonExistentUUID })

        expect(response.statusCode).toBe(404)
    })
})

describe('/tasks/create', () => {
    test('Should create a task', async () => {
        const createResponse = await api('/tasks/create', taskFixture)
        const createdTask: ITasksCreate['Response'] = createResponse.json()

        expect(createResponse.statusCode).toBe(200)
        expect(createdTask).toEqual({
            id: expect.any(String),
            title: taskFixture.title,
            completed: false,
            created_at: expect.any(String),
        })

        const getOneResponse = await api('/tasks/get-one', { id: createdTask.id })

        expect(getOneResponse.statusCode).toBe(200)
    })
})

describe('/tasks/update', () => {
    test('Should update a task and return the updated task object', async () => {
        const updatedTitle = 'Buy almond milk'

        // Create
        const createdTask = await createTask()

        // Update
        const updateResponse = await api('/tasks/update', {
            id: createdTask.id,
            title: updatedTitle,
        })

        expect(updateResponse.statusCode).toBe(200)
        expect(updateResponse.json()).toEqual({
            id: expect.any(String),
            title: updatedTitle,
            completed: false,
            created_at: expect.any(String),
        })

        // Check if updated
        const getOneResponse = await api('/tasks/get-one', { id: createdTask.id })

        expect(getOneResponse.statusCode).toBe(200)
        expect(getOneResponse.json()).toHaveProperty('title', updatedTitle)
    })

    test('Should return 404 error when id is non existent', async () => {
        const response = await api('/tasks/update', {
            id: nonExistentUUID,
            title: 'Buy milk',
        })

        expect(response.statusCode).toBe(404)
    })
})

describe('/tasks/update-completed', () => {
    test('Should update the `completed` field', async () => {
        // Create
        const createdTask = await createTask()

        // Update
        const updateResponse = await api('/tasks/update-completed', {
            id: createdTask.id,
            completed: true,
        })

        expect(updateResponse.statusCode).toBe(200)
        expect(updateResponse.json()).toEqual({ success: true })

        // Check if updated
        const getOneResponse = await api('/tasks/get-one', { id: createdTask.id })

        expect(getOneResponse.statusCode).toBe(200)
        expect(getOneResponse.json()).toHaveProperty('completed', true)
    })

    test('Should return 404 error when id is non existent', async () => {
        const response = await api('/tasks/update-completed', {
            id: nonExistentUUID,
            completed: true,
        })

        expect(response.statusCode).toBe(404)
    })
})

describe('/tasks/delete', () => {
    test('Should delete the created task', async () => {
        // Create
        const createdTask = await createTask()

        // Delete
        const deleteResponse = await api('/tasks/delete', { id: createdTask.id })

        expect(deleteResponse.statusCode).toBe(200)
        expect(deleteResponse.json()).toEqual({ success: true })

        // Check if deleted
        const getOneResponse = await api('/tasks/get-one', { id: createdTask.id })

        expect(getOneResponse.statusCode).toBe(404)
    })

    test('Should return 404 error when id is non existent', async () => {
        const response = await api('/tasks/delete', { id: nonExistentUUID })

        expect(response.statusCode).toBe(404)
    })
})
