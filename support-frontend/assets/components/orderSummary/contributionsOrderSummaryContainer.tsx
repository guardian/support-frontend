import { css } from '@emotion/react';
import { neutral, space } from '@guardian/source/foundations';
import { type ContributionType } from 'helpers/contributions';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { productLegal } from 'helpers/legalCopy';
import type { Promotion } from 'helpers/productPrice/promotions';

const containerSummaryTsCs = css`
	border-radius: ${space[2]}px;
	background-color: ${neutral[97]};
	padding: ${space[3]}px;
`;

export function getTermsStartDateTier3(startDateTier3: string) {
	return (
		<>
			<li>Your digital benefits will start today.</li>
			<li>
				Your Guardian Weekly subscription will start on {startDateTier3}. Please
				allow 1 to 7 days after your start date for your magazine to arrive,
				depending on national post services.
			</li>
		</>
	);
}

export function getTermsConditions(
	countryGroupId: CountryGroupId,
	contributionType: ContributionType,
	productId: string,
	amount: number,
	promotion?: Promotion,
) {
	if (contributionType === 'ONE_OFF') {
		return;
	}
	const period = contributionType === 'MONTHLY' ? 'month' : 'year';
	const isSupporterPlus = productId === 'SupporterPlus';
	const isTier3 = productId === 'TierThree';
	const isAdLite = productId === 'GuardianAdLite';

	if (isSupporterPlus || isTier3) {
		return (
			<div css={containerSummaryTsCs}>
				{promotion && (
					<p>
						You’ll pay{' '}
						{productLegal(
							countryGroupId,
							contributionType,
							'/',
							amount,
							promotion,
						)}{' '}
						afterwards unless you cancel. Offer only available to new
						subscribers who do not have an existing subscription with the
						Guardian.
					</p>
				)}
				{isSupporterPlus && (
					<>
						<p>Auto renews every {period} until you cancel.</p>
						<p>
							Cancel or change your support anytime. If you cancel within the
							first 14 days, you will receive a full refund.
						</p>
					</>
				)}
				{isTier3 && <p>Auto renews every {period}. Cancel anytime.</p>}
			</div>
		);
	}
	const cancelCopy = isAdLite
		? 'Cancel anytime.'
		: 'Cancel or change your support anytime.';
	return (
		<div css={containerSummaryTsCs}>
			<p>Auto renews every {period} until you cancel.</p>
			<p>{cancelCopy}</p>
		</div>
	);
}
