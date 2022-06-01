import { isProd } from '../urls/url';

const referralCodeEndpoint = isProd()
	? 'https://contribution-referrals.support.guardianapis.com/referral-code'
	: 'https://contribution-referrals-code.support.guardianapis.com/referral-code';

const postReferralCode = (
	endpoint: string,
	referralCode: string,
	email: string,
	campaignCode: string,
) =>
	fetch(endpoint, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			source: 'thankyou',
			code: referralCode,
			email,
			campaignId: campaignCode,
		}),
	}).then((response) => console.log(`responseStatus: ${response.status}`));

const newReferralCode = () => {
	const salt = Math.floor(Math.random() * 100 + 1).toString(36);
	const timestamp = new Date().getTime().toString(36);
	return (salt + timestamp).toUpperCase();
};

export const generateReferralCode = (
	email: string,
	campaignCode: string,
): string => {
	const code = newReferralCode();
	void postReferralCode(referralCodeEndpoint, code, email, campaignCode);
	return code;
};
