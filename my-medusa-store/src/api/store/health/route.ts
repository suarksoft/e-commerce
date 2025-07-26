import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      service: "moda-es-es-backend",
      version: "1.0.0"
    })
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Health check failed"
    })
  }
} 