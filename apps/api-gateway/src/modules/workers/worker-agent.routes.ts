import type { FastifyInstance } from "fastify";
import { ativarWorkerAgentInstallLinkController } from "./worker-agent-install.controller.js";
import {
	claimWorkerJobController,
	errorWorkerJobController,
	heartbeatWorkerController,
	progressWorkerJobController,
	successWorkerJobController,
} from "./worker-agent.controller.js";

export async function workerAgentRoutes(app: FastifyInstance) {
	app.post("/agents/install/activate", ativarWorkerAgentInstallLinkController);

	app.post("/workers/heartbeat", heartbeatWorkerController);
	app.post("/workers/jobs/claim", claimWorkerJobController);
	app.post("/workers/jobs/:id/progress", progressWorkerJobController);
	app.post("/workers/jobs/:id/success", successWorkerJobController);
	app.post("/workers/jobs/:id/error", errorWorkerJobController);
}
