import type { FastifyApp } from '../../types'
import { TasksRepository } from './tasks.repository'
import { tasksCreateSchema, tasksDeleteSchema, tasksGetAllSchema, tasksGetOneSchema, tasksUpdateCompletedSchema, tasksUpdateSchema } from './tasks.schemas'
import { TasksService } from './tasks.service'

export async function tasksRoutes(fastify: FastifyApp) {
    const tasksRepository = new TasksRepository(fastify.pg)
    const tasksService = new TasksService(tasksRepository)

    fastify.route({
        method: 'POST',
        url: '/tasks/get-all',
        schema: tasksGetAllSchema,
        async handler() {
            return tasksService.getAll()
        },
    })

    fastify.route({
        method: 'POST',
        url: '/tasks/get-one',
        schema: tasksGetOneSchema,
        async handler(request, reply) {
            return (await tasksService.getOne(request.body)) ?? reply.callNotFound()
        },
    })

    fastify.route({
        method: 'POST',
        url: '/tasks/create',
        schema: tasksCreateSchema,
        async handler(request) {
            return tasksService.create(request.body)
        },
    })

    fastify.route({
        method: 'POST',
        url: '/tasks/update',
        schema: tasksUpdateSchema,
        async handler(request, reply) {
            return (await tasksService.update(request.body)) ?? reply.callNotFound()
        },
    })

    fastify.route({
        method: 'POST',
        url: '/tasks/update-completed',
        schema: tasksUpdateCompletedSchema,
        async handler(request, reply) {
            return (await tasksService.updateCompleted(request.body)) > 0 ? { success: true } : reply.callNotFound()
        },
    })

    fastify.route({
        method: 'POST',
        url: '/tasks/delete',
        schema: tasksDeleteSchema,
        async handler(request, reply) {
            return (await tasksService.delete(request.body)) > 0 ? { success: true } : reply.callNotFound()
        },
    })
}
