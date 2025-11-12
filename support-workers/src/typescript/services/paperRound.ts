import { z } from 'zod';
import type { Stage } from '../model/stage';
import { getConfig } from './config';

const paperRoundSchema = z.object({
	url: z.string(),
	key: z.string(),
});
export type PaperRoundConfig = z.infer<typeof paperRoundSchema>;

const deliveryAgentDetailSchema = z.object({
	agentname: z.string(),
	refid: z.number(),
	refgroupid: z.number(),
	startdate: z.string(),
	enddate: z.string(),
	address1: z.string(),
	address2: z.string(),
	town: z.string(),
	county: z.string(),
	postcode: z.string(),
	telephone: z.string(),
	email: z.string(),
});
export type DeliveryAgentDetails = z.infer<typeof deliveryAgentDetailSchema>;

const deliveryAgentsResponseSchema = z.object({
	data: z.object({
		agents: z.array(deliveryAgentDetailSchema),
	}),
});

export const getPaperRoundConfig = async (
	stage: Stage,
): Promise<PaperRoundConfig> => {
	return getConfig(stage, 'paper-round-config', paperRoundSchema);
};

export class PaperRoundService {
	constructor(private config: PaperRoundConfig) {}

	async agents(): Promise<DeliveryAgentDetails[]> {
		const response = await fetch(`${this.config.url}/agents`, {
			method: 'POST',
			headers: {
				'x-api-key': this.config.key,
			},
		});
		if (response.ok) {
			const json: unknown = await response.json();
			return deliveryAgentsResponseSchema.parse(json).data.agents;
		}
		throw new Error(
			`PaperRound API request failed with status ${response.status}`,
		);
	}

	async getAgentById(refId: number): Promise<DeliveryAgentDetails | undefined> {
		const agents = await this.agents();
		return agents.find((agent) => agent.refid === refId);
	}
}
