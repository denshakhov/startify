import { api } from '../../utils'

class TodoTasksRepository {
    public async getAll(): Promise<ITodoTask[]> {
        return api('/tasks/get-all')
    }

    public async create(payload: any): Promise<ITodoTask> {
        return api('/tasks/create', payload)
    }

    public async update(payload: any): Promise<ITodoTask> {
        return api('/tasks/update', payload)
    }

    public async updateCompleted(payload: any): Promise<ISuccessResponse> {
        return api('/tasks/update-completed', payload)
    }

    public async delete(payload: any): Promise<ISuccessResponse> {
        return api('/tasks/delete', payload)
    }
}

export interface ISuccessResponse {
    success: true
}

export interface ITodoTask {
    id: string
    title: string
    completed: boolean
    created_at: string
}

export const todoTasksRepository = new TodoTasksRepository()
