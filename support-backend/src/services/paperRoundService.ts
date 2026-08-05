import z from 'zod';

const coverageStatusSchema = z.enum([
	'CO', // Postcode is covered, see agent list
	'NC', // Postcode has no agent coverage
	'MP', // Postcode is missing from the list of valid postcodes
	'IP', // Problem with input
	'IE', // Internal PaperRound system error
]);

const agentsCoverageSchema = z.object({
	agentid: z.number(),
	agentname: z.string(),
	deliverymethod: z.string(),
	nbrdeliverydays: z.number(),
	postcode: z.string(),
	refgroupid: z.number(),
	summary: z.string(),
});

export type AgentCoverage = z.infer<typeof agentsCoverageSchema>;

const postcodeCoverageSchema = z.object({
	agents: z.array(agentsCoverageSchema),
	message: z.string(),
	status: coverageStatusSchema,
});

const coverageResponseSchema = z.object({
	status_code: z.number(),
	data: postcodeCoverageSchema,
});

export type CoverageResponse = z.infer<typeof coverageResponseSchema>;

export class PaperRoundService {
	private readonly baseUrl: string;
	private readonly apiKey: string;

	constructor(baseUrl: string, apiKey: string) {
		this.baseUrl = baseUrl;
		this.apiKey = apiKey;
	}

	async coverage(postcode: string): Promise<CoverageResponse> {
		const url = `${this.baseUrl}/coverage`;

		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'x-api-key': this.apiKey,
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: new URLSearchParams({ postcode }),
		});

		if (!response.ok) {
			throw new Error(
				'Received error response from PaperRound: ' + response.status,
			);
		}

		const parsed = coverageResponseSchema.safeParse(await response.json());

		if (!parsed.success) {
			throw new Error(`Invalid coverage response: ${parsed.error.message}`);
		}

		return parsed.data;
	}
}
