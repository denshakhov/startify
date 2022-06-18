import { Client } from 'pg'

if (['production', 'staging'].includes(process.env.RUN_ENV!)) {
    throw new Error('The script cannot be run in production or staging environment')
}

async function setup() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    })

    await client.connect()
    await client.query(/* sql */ `DROP DATABASE IF EXISTS app_testing`)
    await client.query(/* sql */ `CREATE DATABASE app_testing`)
    await client.end()
}

setup().catch(error => {
    console.error(error)
    process.exit(1)
})
