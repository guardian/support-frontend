export type MultipleAccountApiResponse = {
	status: number;
	body: string;
};

// Thin client for the multiple-account API. Upstream status codes are
// meaningful to callers (e.g. 404 unknown code, 400 cancelled, 410 already
// accepted), so the raw status and body are returned rather than thrown.
export class MultipleAccountApiService {
	private readonly baseUrl: string;
	private readonly apiKey: string;

	constructor(baseUrl: string, apiKey: string) {
		this.baseUrl = baseUrl;
		this.apiKey = apiKey;
	}

	async getInvitation(
		invitationCode: string,
	): Promise<MultipleAccountApiResponse> {
		const url = `${this.baseUrl}/invitation/${encodeURIComponent(
			invitationCode,
		)}`;

		const response = await fetch(url, {
			headers: {
				'x-api-key': this.apiKey,
			},
		});

		return { status: response.status, body: await response.text() };
	}
}
