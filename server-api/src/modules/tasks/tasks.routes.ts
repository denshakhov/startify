import { FastifyApp } from '../../types'
import { TasksRepository } from './tasks.repository'
import { tasksCreateSchema, tasksDeleteSchema, tasksGetAllSchema, tasksGetOneSchema, tasksUpdateCompletedSchema, tasksUpdateSchema } from './tasks.schemas'

export async function tasksRoutes(fastify: FastifyApp) {
    const tasksRepository = new TasksRepository(fastify.pg)

    fastify.route({
        method: 'POST',
        url: '/tasks/get-all',
        schema: tasksGetAllSchema,
        async handler() {
            return tasksRepository.getAll()
        },
    })

    fastify.route({
        method: 'POST',
        url: '/tasks/get-one',
        schema: tasksGetOneSchema,
        async handler(request, reply) {
            return (await tasksRepository.getOne(request.body)) ?? reply.callNotFound()
        },
    })

    fastify.route({
        method: 'POST',
        url: '/tasks/create',
        schema: tasksCreateSchema,
        async handler(request) {
            return tasksRepository.create(request.body)
        },
    })

    fastify.route({
        method: 'POST',
        url: '/tasks/update',
        schema: tasksUpdateSchema,
        async handler(request, reply) {
            return (await tasksRepository.update(request.body)) ?? reply.callNotFound()
        },
    })

    fastify.route({
        method: 'POST',
        url: '/tasks/update-completed',
        schema: tasksUpdateCompletedSchema,
        async handler(request, reply) {
            return (await tasksRepository.updateCompleted(request.body)) > 0 ? { success: true } : reply.callNotFound()
        },
    })

    fastify.route({
        method: 'POST',
        url: '/tasks/delete',
        schema: tasksDeleteSchema,
        async handler(request, reply) {
            return (await tasksRepository.delete(request.body)) > 0 ? { success: true } : reply.callNotFound()
        },
    })
}
