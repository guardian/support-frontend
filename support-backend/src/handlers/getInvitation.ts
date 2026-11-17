import type { RequestHandler } from 'express';
import z from 'zod';
import type {
	MultipleAccountApiResponse,
	MultipleAccountApiService,
} from '../services/multipleAccountApiService';

const invitationExpirySchema = z.object({
	expiryDate: z.number(),
});

type GetInvitationResult =
	| { status: number; type: 'json'; body: string | object }
	| { status: number; type: 'text'; body: string };

const parseExpiryDate = (body: string): number | undefined => {
	try {
		const parsed = invitationExpirySchema.parse(JSON.parse(body));
		return parsed.expiryDate;
	} catch {
		return undefined;
	}
};

// A 200 whose expiryDate has passed is returned as 410 with reason "expired"
// so expiry is decided with server time. Upstream 410 is returned with reason
// "alreadyAccepted". Any other non-200 upstream response is passed through.
export const resultFromGetInvitation = (
	{ status, body }: MultipleAccountApiResponse,
	nowMillis: number = Date.now(),
): GetInvitationResult => {
	if (status === 410) {
		return { status: 410, type: 'json', body: { reason: 'alreadyAccepted' } };
	}

	if (status !== 200) {
		return { status, type: 'json', body };
	}

	const expiryDate = parseExpiryDate(body);

	if (expiryDate === undefined) {
		return {
			status: 500,
			type: 'text',
			body: 'Invitation response missing expiryDate',
		};
	}

	if (expiryDate <= nowMillis) {
		return { status: 410, type: 'json', body: { reason: 'expired' } };
	}

	return { status: 200, type: 'json', body };
};

export const buildGetInvitationHandler =
	(
		multipleAccountApiService: MultipleAccountApiService,
	): RequestHandler<{ invitationCode: string }> =>
	async (req, res) => {
		try {
			const response = await multipleAccountApiService.getInvitation(
				req.params.invitationCode,
			);

			const result = resultFromGetInvitation(response);

			res.status(result.status).type(result.type).send(result.body);
		} catch (error) {
			console.error(
				'Failed to fetch invitation from the multiple-account API',
				error,
			);
			res.status(500).send();
		}
	};
