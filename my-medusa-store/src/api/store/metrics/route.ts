import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const metrics = {
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
      version: process.version,
      platform: process.platform,
      arch: process.arch,
      pid: process.pid,
      nodeEnv: process.env.NODE_ENV,
    }

    res.json(metrics)
  } catch (error) {
    res.status(500).json({
      error: "Failed to get metrics",
      message: error instanceof Error ? error.message : "Unknown error"
    })
  }
} 