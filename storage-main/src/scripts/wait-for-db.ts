import { setTimeout } from 'node:timers/promises'
import { Client } from 'pg'
import { pgConfig } from '../config'

async function waitForConnection(timeoutSeconds: number = 10) {
    for (let i = 1; i <= timeoutSeconds; i++) {
        try {
            const client = new Client({
                ...pgConfig,
                connectionString: process.env.DATABASE_URL,
            })

            await client.connect()
            await client.end()

            console.info('Successfully connected to the database.')

            process.exit(0)
        } catch (error) {
            console.error(error)
            console.error(`Error connecting to the database. Retrying in 1 sec (${i}/${timeoutSeconds}).`)

            await setTimeout(1000)
        }
    }

    throw new Error('Error connecting to the database. Aborting.')
}

waitForConnection().catch(error => {
    console.error(error)
    process.exit(1)
})
