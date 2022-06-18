import { Static, Type } from '@sinclair/typebox'

const uuidSchema = Type.String({ pattern: '^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$' })
const titleSchema = Type.String({ minLength: 1, maxLength: 200 })
const taskResponseSchema = Type.Object({
    id: uuidSchema,
    title: titleSchema,
    completed: Type.Boolean(),
    created_at: Type.String(),
})
const successResponseSchema = Type.Object({
    success: Type.Boolean(),
})

// Get all tasks
// ----------------------------------------------------------------------------
export const tasksGetAllSchema = {
    response: {
        200: Type.Array(taskResponseSchema),
    },
}

export interface ITasksGetAllRoute {
    Response: Static<typeof tasksGetAllSchema.response['200']>
}

// Get one task
// ----------------------------------------------------------------------------
export const tasksGetOneSchema = {
    body: Type.Object({
        id: uuidSchema,
    }),
    response: {
        200: taskResponseSchema,
    },
}

export interface ITasksGetOneRoute {
    Body: Static<typeof tasksGetOneSchema.body>
    Response: Static<typeof tasksGetOneSchema.response['200']>
}

// Create a task
// ----------------------------------------------------------------------------
export const tasksCreateSchema = {
    body: Type.Object({
        title: titleSchema,
    }),
    response: {
        200: taskResponseSchema,
    },
}

export interface ITasksCreate {
    Body: Static<typeof tasksCreateSchema.body>
    Response: Static<typeof tasksCreateSchema.response['200']>
}

// Update a task
// ----------------------------------------------------------------------------
export const tasksUpdateSchema = {
    body: Type.Object({
        id: uuidSchema,
        title: titleSchema,
    }),
    response: {
        200: taskResponseSchema,
    },
}

export interface ITasksUpdate {
    Body: Static<typeof tasksUpdateSchema.body>
    Response: Static<typeof tasksUpdateSchema.response['200']>
}

// Update the `completed` field
// ----------------------------------------------------------------------------
export const tasksUpdateCompletedSchema = {
    body: Type.Object({
        id: uuidSchema,
        completed: Type.Boolean(),
    }),
    response: {
        200: successResponseSchema,
    },
}

export interface ITasksUpdateCompleted {
    Body: Static<typeof tasksUpdateCompletedSchema.body>
    Response: Static<typeof tasksUpdateCompletedSchema.response['200']>
}

// Delete a task
// ----------------------------------------------------------------------------
export const tasksDeleteSchema = {
    body: Type.Object({
        id: uuidSchema,
    }),
    response: {
        200: successResponseSchema,
    },
}

export interface ITasksDelete {
    Body: Static<typeof tasksDeleteSchema.body>
    Response: Static<typeof tasksDeleteSchema.response['200']>
}
