import type { TasksRepository } from './tasks.repository'
import type { ITasksCreate, ITasksDelete, ITasksGetAllRoute, ITasksGetOneRoute, ITasksUpdate, ITasksUpdateCompleted } from './tasks.schemas'

export class TasksService {
    constructor(private readonly repo: TasksRepository) {}

    public async getAll(): Promise<ITasksGetAllRoute['Response']> {
        return this.repo.getAll()
    }

    public async getOne(params: ITasksGetOneRoute['Body']): Promise<ITasksGetOneRoute['Response'] | undefined> {
        return this.repo.getOne(params)
    }

    public async create(params: ITasksCreate['Body']): Promise<ITasksCreate['Response']> {
        return this.repo.create(params)
    }

    public async update(params: ITasksUpdate['Body']): Promise<ITasksUpdate['Response'] | undefined> {
        return this.repo.update(params)
    }

    public async updateCompleted(params: ITasksUpdateCompleted['Body']): Promise<number> {
        return this.repo.updateCompleted(params)
    }

    public async delete(params: ITasksDelete['Body']): Promise<number> {
        return this.repo.delete(params)
    }
}
