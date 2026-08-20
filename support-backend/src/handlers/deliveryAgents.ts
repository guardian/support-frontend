import type { RequestHandler } from 'express';
import { putMetric } from '../aws/cloudwatch';
import type {
	AgentCoverage,
	PaperRoundService,
} from '../services/paperRoundService';

type AgentResponse = {
	agentId: number;
	agentName: string;
	deliveryMethod: string;
	nbrDeliveryDays: number;
	postcode: string;
	refGroupId: number;
	summary: string;
};

function mapAgentForResponse(agent: AgentCoverage): AgentResponse {
	return {
		agentId: agent.agentid,
		agentName: agent.agentname,
		deliveryMethod: agent.deliverymethod,
		nbrDeliveryDays: agent.nbrdeliverydays,
		postcode: agent.postcode,
		refGroupId: agent.refgroupid,
		summary: agent.summary,
	};
}

export const buildDeliveryAgentsHandler =
	(
		paperRoundService: PaperRoundService,
	): RequestHandler<{ postcode: string }> =>
	async (req, res) => {
		const postcode = decodeURIComponent(req.params.postcode);

		console.log(`Delivery agents handler called with ${postcode}`);

		try {
			const result = await paperRoundService.coverage(postcode);

			void putMetric(
				result.data.status === 'IE'
					? 'GetDeliveryAgentsFailure'
					: 'GetDeliveryAgentsSuccess',
			);

			switch (result.data.status) {
				case 'CO':
					return res.json({
						type: 'Covered',
						agents: result.data.agents.map((a) => mapAgentForResponse(a)),
					});
				case 'NC':
					return res.json({ type: 'NotCovered' });
				case 'MP':
					return res.status(404).json({ type: 'UnknownPostcode' });
				case 'IP':
					return res.status(400).json({ type: 'ProblemWithInput' });
				case 'IE':
					console.error(
						`Got internal error from PaperRound: ${result.data.message}`,
					);
					return res.status(500).send();
			}
		} catch (error) {
			console.error(error);
			void putMetric('GetDeliveryAgentsFailure');
			return res.status(500).send();
		}
	};
