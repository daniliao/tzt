import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import { sql } from 'drizzle-orm';
import path from 'path'
import { getCurrentTS } from '@/lib/utils';
import fs from 'fs';
import * as schema from './db-schema';

const rootPath = path.resolve(process.cwd())

export type DatabaseManifest = {
	databaseIdHash: string,
	createdAt: string,

	creator: {
		ip?: string,
		ua?: string,
		geo?: {
			country?: string,
			city?: string,
			latitute?: string,
			longitude?: string,
		}
	}
}

export const maintenance = { 
	databaseDirectory: (databaseId:string, databaseSchema:string = '', databasePartition: string = '') =>  path.join(rootPath, 'data', databaseId, databasePartition ? databaseSchema + '-partitions' : ''),
	databaseFileName: (databaseId:string, databaseSchema:string = '', databasePartition: string = '') =>  path.join(maintenance.databaseDirectory(databaseId, databaseSchema, databasePartition), `db${databaseSchema ? '-' + databaseSchema + (databasePartition ? '-' + databasePartition : '') : ''}.sqlite`),
	createDatabaseManifest: async (databaseId: string, databaseManifest: DatabaseManifest) => {
		const databaseDirectory = maintenance.databaseDirectory(databaseId)
		if (!fs.existsSync(databaseDirectory)) {
			fs.mkdirSync(databaseDirectory, { recursive: true })
		}

		console.log('Creating new database hash = ' + databaseId);
		const newDb = (await pool)(databaseId, '', '', true); // create main database file (empty schema)

		const manifestPath = path.join(databaseDirectory, 'manifest.json')
		if (!fs.existsSync(manifestPath)) {
			fs.writeFileSync(manifestPath, JSON.stringify({
				...databaseManifest,
				createdAt: getCurrentTS(),
			}))
		}
	},
	checkIfDatabaseExists: (databaseId: string) => {
		try {
			fs.accessSync(maintenance.databaseFileName(databaseId))
			return true
		} catch (error) {
			return false
		}
	}
}

export const Pool = async (maxPool = 50) => {
	const databaseInstances: Record<string, any> = {}
	return async (databaseId: string, databaseSchema: string = '', databasePartition: string = '', createNewDb: boolean = false) => {
		const poolKey = `${databaseId}-${databaseSchema}${databasePartition ? '-' + databasePartition : ''}`
		if (databaseInstances[poolKey]) {
			return databaseInstances[poolKey]
		}

		const connectionString = process.env.NEON_DATABASE_URL
		if (!connectionString) {
			throw new Error('NEON_DATABASE_URL environment variable is not set')
		}

		const neonSql = neon(connectionString)
		const db = drizzle(neonSql, { schema })

		try {
			// Test database connection and permissions
			console.log('Testing database connection...')
			const testResult = await neonSql`SELECT current_user, current_database()`
			console.log('Database connection test result:', testResult)

			// Create schema if it doesn't exist
			console.log('Creating schema:', databaseId)
			await neonSql.unsafe(`CREATE SCHEMA IF NOT EXISTS "${databaseId}"`)

			// Set the search path to the schema
			console.log('Setting search path to schema:', databaseId)
			await neonSql.unsafe(`SET search_path TO "${databaseId}"`)

			// Check if tables exist in the schema
			console.log('Checking for existing tables...')
			const tables = await neonSql`
				SELECT table_name 
				FROM information_schema.tables 
				WHERE table_schema = ${databaseId}
			`
			console.log('Existing tables:', tables)

			// Only run migrations if no tables exist
			if (tables.length === 0) {
				console.log('No tables found, running migrations...')
				try {
					// Set the search path to the schema before running migrations
					await neonSql.unsafe(`SET search_path TO "${databaseId}"`)
					
					// Run migrations
					await migrate(db, { migrationsFolder: 'drizzle' })
					console.log('Migrations completed successfully')
					
					// Reset search path after migrations
					await neonSql.unsafe('SET search_path TO DEFAULT')
				} catch (error: any) {
					// If tables or constraints already exist, that's fine
					if (error.cause?.code === '42710' || error.cause?.code === '42P07') {
						console.log('Tables or constraints already exist, continuing...')
					} else {
						console.error('Migration error:', error)
						throw error
					}
				}
			} else {
				console.log('Tables already exist, skipping migrations')
			}

			databaseInstances[poolKey] = db
			return db
		} catch (error) {
			console.error('Database operation error:', error)
			throw error
		}
	}
}

export const pool = Pool()