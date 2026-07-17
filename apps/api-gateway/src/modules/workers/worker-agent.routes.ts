import type { FastifyInstance } from "fastify";
import {
  claimWorkerJobController,
  errorWorkerJobController,
  heartbeatWorkerController,
  progressWorkerJobController,
  successWorkerJobController,
} from "./worker-agent.controller.js";

export async function workerAgentRoutes(app: FastifyInstance) {
  app.post("/workers/heartbeat", heartbeatWorkerController);
  app.post("/workers/jobs/claim", claimWorkerJobController);
  app.post("/workers/jobs/:id/progress", progressWorkerJobController);
  app.post("/workers/jobs/:id/success", successWorkerJobController);
  app.post("/workers/jobs/:id/error", errorWorkerJobController);
}
