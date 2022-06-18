import { ClientConfig } from 'pg'

export const pgConfig: ClientConfig = {
    ssl: ['production', 'staging'].includes(process.env.RUN_ENV!)
        ? {
              rejectUnauthorized: false,
          }
        : undefined,
}
