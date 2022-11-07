import type { PostgresDb } from '@fastify/postgres'
import type { ITasksCreate, ITasksDelete, ITasksGetAllRoute, ITasksGetOneRoute, ITasksUpdate, ITasksUpdateCompleted } from './tasks.schemas'

export class TasksRepository {
    constructor(private readonly pg: PostgresDb) {}

    public async getAll(): Promise<ITasksGetAllRoute['Response']> {
        const { rows } = await this.pg.query(/* sql */ `SELECT * FROM tasks ORDER BY created_at DESC`)

        return rows
    }

    public async getOne(params: ITasksGetOneRoute['Body']): Promise<ITasksGetOneRoute['Response'] | undefined> {
        const { rows } = await this.pg.query(/* sql */ `SELECT * FROM tasks WHERE id = $1`, [params.id])

        return rows[0]
    }

    public async create(params: ITasksCreate['Body']): Promise<ITasksCreate['Response']> {
        const { rows } = await this.pg.query(/* sql */ `INSERT INTO tasks(title) VALUES ($1) RETURNING *`, [params.title])

        return rows[0]!
    }

    public async update(params: ITasksUpdate['Body']): Promise<ITasksUpdate['Response'] | undefined> {
        const { rows } = await this.pg.query(/* sql */ `UPDATE tasks SET title = $1 WHERE id = $2 RETURNING *`, [params.title, params.id])

        return rows[0]!
    }

    public async updateCompleted(params: ITasksUpdateCompleted['Body']): Promise<number> {
        const { rowCount } = await this.pg.query(/* sql */ `UPDATE tasks SET completed = $1 WHERE id = $2`, [params.completed, params.id])

        return rowCount
    }

    public async delete(params: ITasksDelete['Body']): Promise<number> {
        const { rowCount } = await this.pg.query(/* sql */ `DELETE FROM tasks WHERE id = $1`, [params.id])

        return rowCount
    }
}
