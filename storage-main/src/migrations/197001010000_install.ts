import { Knex } from 'knex'

export async function up(db: Knex) {
    await db.raw(/* sql */ `
        CREATE TABLE IF NOT EXISTS tasks (
            id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
            title      TEXT        NOT NULL,
            completed  BOOLEAN     NOT NULL DEFAULT FALSE,
            created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
        );

        CREATE INDEX idx_tasks__created_at ON tasks (created_at DESC);
    `)
}

export async function down(db: Knex) {
    await db.raw(/* sql */ `DROP TABLE IF EXISTS tasks CASCADE`)
}

export const configuration = {
    transaction: true,
}
