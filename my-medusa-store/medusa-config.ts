import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

// Ensure SSL for production database connections
const getDatabaseUrl = () => {
  const dbUrl = process.env.DATABASE_URL
  if (process.env.NODE_ENV === 'production' && dbUrl && !dbUrl.includes('sslmode')) {
    return `${dbUrl}?sslmode=require`
  }
  return dbUrl
}

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: getDatabaseUrl(),
    databaseDriverOptions: 
      process.env.NODE_ENV === 'production' 
        ? {
            connection: {
              ssl: {
                rejectUnauthorized: false
              }
            }
          }
        : {},
    http: {
      storeCors: process.env.STORE_CORS || "*",
      adminCors: process.env.ADMIN_CORS || "*",
      authCors: process.env.AUTH_CORS || "*",
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
    // Redis for caching (optional)
    redisUrl: process.env.REDIS_URL,
  },
  plugins: [
    // Add any production plugins here
  ]
})
