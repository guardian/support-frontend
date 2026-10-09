import { withoutExtraAccountsBenefit } from 'helpers/onboardingInvitee/inviteeBenefits';

describe('withoutExtraAccountsBenefit', () => {
	it('removes the sharing benefit from the invitee list', () => {
		const benefits = withoutExtraAccountsBenefit([
			{ isChecked: true, text: 'Three extra accounts to share' },
			{ isChecked: true, text: 'Unlimited access to the premium Guardian app' },
		]);

		expect(benefits.map((benefit) => benefit.text)).toEqual([
			'Unlimited access to the premium Guardian app',
		]);
	});

	it('leaves the list unchanged when the sharing benefit is absent', () => {
		const benefits = [
			{ isChecked: true, text: 'Ad-free reading on all your devices' },
		];

		expect(withoutExtraAccountsBenefit(benefits)).toEqual(benefits);
	});
});
