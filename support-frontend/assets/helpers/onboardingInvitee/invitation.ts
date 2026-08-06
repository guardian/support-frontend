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

interface InvitationResponse {
	subscriptionName: string;
	invitationCode: string;
	primaryIdentityId: string;
	secondaryUserEmail: string;
	secondaryIdentityId: string;
	invitedDate: string;
	expiryDate: number;
}

// Verifies an invitation via the Play server, which proxies the multiple-account
// API and attaches the API key server side. A 404 means the code doesn't exist
// and a 400 means it has been cancelled; both (along with any unexpected
// failure) are surfaced as 'invalid'. Expiry is derived from the expiryDate
// epoch-millis in the response.
export async function verifyInvitation(
	invitationCode: string,
): Promise<VerifyInvitationResult> {
	try {
		const response = await fetch(
			`/invitation/${encodeURIComponent(invitationCode)}`,
		);

		if (!response.ok) {
			return { status: 'invalid' };
		}

		const invitation = (await response.json()) as InvitationResponse;

		if (invitation.expiryDate <= Date.now()) {
			return { status: 'expired' };
		}

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

// Accepts an invitation via the Play server, which authenticates the user from
// Okta cookies and forwards x-api-key + x-identity-id upstream.
export async function acceptInvitation(
	invitationCode: string,
	csrf: CsrfState,
): Promise<boolean> {
	try {
		const response = await fetch(
			`/invitation/${encodeURIComponent(invitationCode)}/accept`,
			requestOptions({}, 'same-origin', 'POST', csrf),
		);
		return response.ok;
	} catch {
		return false;
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
