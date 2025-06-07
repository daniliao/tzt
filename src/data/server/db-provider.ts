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

			// Check if all required tables exist
			const requiredTables = ['audit', 'config', 'encryptedAttachments', 'folders', 'keys', 'records', 'stats', 'terms']
			const missingTables = requiredTables.filter(table => !tables.some(t => t.table_name === table))

			// Run migrations if any required tables are missing
			if (missingTables.length > 0) {
				console.log('Missing tables:', missingTables)
				console.log('Creating missing tables...')
				try {
					// Create missing tables
					for (const table of missingTables) {
						console.log(`Creating table ${table}...`)
						switch (table) {
							case 'stats':
								await neonSql.unsafe(`
									CREATE TABLE IF NOT EXISTS "${databaseId}"."stats" (
										"id" serial PRIMARY KEY,
										"eventName" text,
										"promptTokens" integer,
										"completionTokens" integer,
										"finishReasons" text,
										"createdAt" timestamp NOT NULL DEFAULT now(),
										"createdMonth" integer,
										"createdDay" integer,
										"createdYear" integer,
										"createdHour" integer,
										"counter" integer
									);
									CREATE UNIQUE INDEX IF NOT EXISTS "${databaseId}"."stats_unique_idx" ON "${databaseId}"."stats" ("createdHour", "createdDay", "createdMonth", "createdYear", "eventName");
									CREATE INDEX IF NOT EXISTS "${databaseId}"."stats_date_idx" ON "${databaseId}"."stats" ("createdYear", "createdMonth", "createdDay");
									CREATE INDEX IF NOT EXISTS "${databaseId}"."stats_event_idx" ON "${databaseId}"."stats" ("eventName");
								`)
								break;
							case 'audit':
								await neonSql.unsafe(`
									CREATE TABLE IF NOT EXISTS "${databaseId}"."audit" (
										"id" serial PRIMARY KEY,
										"ip" text NOT NULL DEFAULT '',
										"ua" text NOT NULL DEFAULT '',
										"keyLocatorHash" text NOT NULL DEFAULT '',
										"databaseIdHash" text NOT NULL DEFAULT '',
										"recordLocator" text NOT NULL DEFAULT '',
										"diff" text NOT NULL DEFAULT '',
										"eventName" text NOT NULL DEFAULT '',
										"createdAt" timestamp NOT NULL DEFAULT now()
									);
									CREATE INDEX IF NOT EXISTS "${databaseId}"."audit_created_at_idx" ON "${databaseId}"."audit" ("createdAt");
									CREATE INDEX IF NOT EXISTS "${databaseId}"."audit_event_name_idx" ON "${databaseId}"."audit" ("eventName");
								`)
								break;
							case 'config':
								await neonSql.unsafe(`
									CREATE TABLE IF NOT EXISTS "${databaseId}"."config" (
										"id" serial PRIMARY KEY,
										"key" text NOT NULL UNIQUE,
										"value" text NOT NULL DEFAULT '',
										"createdAt" timestamp NOT NULL DEFAULT now(),
										"updatedAt" timestamp NOT NULL DEFAULT now()
									);
									CREATE INDEX IF NOT EXISTS "${databaseId}"."config_key_idx" ON "${databaseId}"."config" ("key");
								`)
								break;
							case 'encryptedAttachments':
								await neonSql.unsafe(`
									CREATE TABLE IF NOT EXISTS "${databaseId}"."encryptedAttachments" (
										"id" serial PRIMARY KEY,
										"recordId" text NOT NULL,
										"name" text NOT NULL,
										"type" text NOT NULL,
										"size" integer NOT NULL,
										"data" text NOT NULL,
										"createdAt" timestamp NOT NULL DEFAULT now(),
										"updatedAt" timestamp NOT NULL DEFAULT now()
									);
									CREATE INDEX IF NOT EXISTS "${databaseId}"."encryptedAttachments_record_id_idx" ON "${databaseId}"."encryptedAttachments" ("recordId");
								`)
								break;
							case 'folders':
								await neonSql.unsafe(`
									CREATE TABLE IF NOT EXISTS "${databaseId}"."folders" (
										"id" serial PRIMARY KEY,
										"name" text NOT NULL,
										"parentId" text NOT NULL DEFAULT '',
										"createdAt" timestamp NOT NULL DEFAULT now(),
										"updatedAt" timestamp NOT NULL DEFAULT now()
									);
									CREATE INDEX IF NOT EXISTS "${databaseId}"."folders_parent_id_idx" ON "${databaseId}"."folders" ("parentId");
								`)
								break;
							case 'keys':
								await neonSql.unsafe(`
									CREATE TABLE IF NOT EXISTS "${databaseId}"."keys" (
										"id" serial PRIMARY KEY,
										"keyLocatorHash" text NOT NULL UNIQUE,
										"key" text NOT NULL,
										"createdAt" timestamp NOT NULL DEFAULT now(),
										"updatedAt" timestamp NOT NULL DEFAULT now()
									);
									CREATE INDEX IF NOT EXISTS "${databaseId}"."keys_key_locator_hash_idx" ON "${databaseId}"."keys" ("keyLocatorHash");
								`)
								break;
							case 'records':
								await neonSql.unsafe(`
									CREATE TABLE IF NOT EXISTS "${databaseId}"."records" (
										"id" serial PRIMARY KEY,
										"folderId" text NOT NULL,
										"description" text NOT NULL DEFAULT '',
										"type" text NOT NULL DEFAULT '',
										"title" text NOT NULL DEFAULT '',
										"tags" text NOT NULL DEFAULT '',
										"json" text NOT NULL DEFAULT '',
										"text" text NOT NULL DEFAULT '',
										"transcription" text NOT NULL DEFAULT '',
										"checksum" text NOT NULL DEFAULT '',
										"checksumLastParsed" timestamp,
										"extra" text NOT NULL DEFAULT '',
										"attachments" text NOT NULL DEFAULT '',
										"eventDate" text NOT NULL DEFAULT '',
										"createdAt" timestamp NOT NULL DEFAULT now(),
										"updatedAt" timestamp NOT NULL DEFAULT now()
									);
									CREATE INDEX IF NOT EXISTS "${databaseId}"."records_folder_id_idx" ON "${databaseId}"."records" ("folderId");
									CREATE INDEX IF NOT EXISTS "${databaseId}"."records_type_idx" ON "${databaseId}"."records" ("type");
									CREATE INDEX IF NOT EXISTS "${databaseId}"."records_created_at_idx" ON "${databaseId}"."records" ("createdAt");
									CREATE INDEX IF NOT EXISTS "${databaseId}"."records_updated_at_idx" ON "${databaseId}"."records" ("updatedAt");
								`)
								break;
							case 'terms':
								await neonSql.unsafe(`
									CREATE TABLE IF NOT EXISTS "${databaseId}"."terms" (
										"id" serial PRIMARY KEY,
										"term" text NOT NULL,
										"type" text NOT NULL DEFAULT '',
										"createdAt" timestamp NOT NULL DEFAULT now(),
										"updatedAt" timestamp NOT NULL DEFAULT now()
									);
									CREATE INDEX IF NOT EXISTS "${databaseId}"."terms_term_idx" ON "${databaseId}"."terms" ("term");
									CREATE INDEX IF NOT EXISTS "${databaseId}"."terms_type_idx" ON "${databaseId}"."terms" ("type");
								`)
								break;
						}
					}

					// Run migrations after creating tables
					console.log('Running migrations...')
					await migrate(db, { migrationsFolder: 'drizzle' })
					console.log('Migrations completed successfully')
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
				console.log('All required tables exist, skipping migrations')
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