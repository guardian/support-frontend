import { z } from 'zod';
import { requestOptions } from 'helpers/async/fetch';
import type { CsrfState } from 'helpers/types/csrf';

export interface OnboardingInviteeInvitation {
	invitationCode: string;
	email: string;
	inviterFirstName?: string;
}

type InvitationStatus = 'valid' | 'expired' | 'invalid';

export interface VerifyInvitationResult {
	status: InvitationStatus;
	invitation?: OnboardingInviteeInvitation;
}

const invitationResponseSchema = z.object({
	subscriptionName: z.string(),
	invitationCode: z.string(),
	primaryIdentityId: z.string(),
	secondaryUserEmail: z.string(),
	secondaryIdentityId: z.string(),
	invitedDate: z.string(),
	expiryDate: z.number(),
});

// Verifies an invitation via the Play server, which proxies the multiple-account
// API and attaches the API key server side. A 404 means the code doesn't exist,
// a 400 means it has been cancelled, and a 410 means it has expired. Those
// statuses (along with any unexpected failure or a response that doesn't match
// the expected shape) are surfaced as 'invalid' or 'expired'. Expiry is decided
// on the server using the expiryDate in the upstream response.
export async function verifyInvitation(
	invitationCode: string,
): Promise<VerifyInvitationResult> {
	try {
		const response = await fetch(
			`/invitation/${encodeURIComponent(invitationCode)}`,
		);

		if (response.status === 410) {
			return { status: 'expired' };
		}

		if (!response.ok) {
			return { status: 'invalid' };
		}

		const parsedInvitation = invitationResponseSchema.safeParse(
			await response.json(),
		);

		if (!parsedInvitation.success) {
			return { status: 'invalid' };
		}

		const invitation = parsedInvitation.data;

		return {
			status: 'valid',
			invitation: {
				invitationCode: invitation.invitationCode,
				email: invitation.secondaryUserEmail,
			},
		};
	} catch {
		return { status: 'invalid' };
	}
}

export type AcceptInvitationResult =
	| 'pending'
	| 'accepted'
	| 'wrongUser'
	| 'failed';

// Accepts an invitation via the Play server, which authenticates the user from
// Okta cookies and forwards x-api-key + x-identity-id upstream. A 400 means the
// signed-in user does not match the invited email.
export async function acceptInvitation(
	invitationCode: string,
	csrf: CsrfState,
): Promise<AcceptInvitationResult> {
	try {
		const response = await fetch(
			`/invitation/${encodeURIComponent(invitationCode)}/accept`,
			requestOptions({}, 'same-origin', 'POST', csrf),
		);

		if (response.ok) {
			return 'accepted';
		}

		if (response.status === 400) {
			return 'wrongUser';
		}

		return 'failed';
	} catch {
		return 'failed';
	}
}

// Declines an invitation via the Play server. Play looks up the invitation and
// attaches the secondary user's identity id upstream; no login required. CSRF
// is still enforced.
export async function declineInvitation(
	invitationCode: string,
	csrf: CsrfState,
): Promise<boolean> {
	try {
		const response = await fetch(
			`/invitation/${encodeURIComponent(invitationCode)}`,
			{
				method: 'DELETE',
				credentials: 'same-origin',
				headers: {
					'Content-Type': 'application/json',
					'Csrf-Token': csrf.token ?? '',
				},
			},
		);
		return response.ok;
	} catch {
		return false;
	}
}
