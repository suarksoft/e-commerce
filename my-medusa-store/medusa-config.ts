import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

// Database URL with SSL for production
const getDatabaseUrl = () => {
  const dbUrl = process.env.DATABASE_URL
  
  if (!dbUrl) return undefined
  
  if (process.env.NODE_ENV === 'production') {
    // Add SSL parameters for production
    return dbUrl.includes('?') 
      ? `${dbUrl}&sslmode=require` 
      : `${dbUrl}?sslmode=require`
  }
  
  return dbUrl
}

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: getDatabaseUrl(),
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
