import type { Knex } from 'knex'
import { pgConfig } from './config'

const knexconfig: Knex.Config = {
    client: 'pg',
    connection: {
        ...(pgConfig as any),
        connectionString: process.env['RUN_ENV'] === 'ci' ? process.env['DATABASE_TESTING_URL'] : process.env['DATABASE_URL'],
    },
    pool: {
        min: 0,
        max: 1,
    },
    migrations: {
        directory: './migrations',
    },
}

export default knexconfig
