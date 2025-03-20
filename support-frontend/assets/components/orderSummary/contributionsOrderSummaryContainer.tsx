import { css } from '@emotion/react';
import { neutral, space } from '@guardian/source/foundations';
import { type ContributionType } from 'helpers/contributions';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { productLegal } from 'helpers/legalCopy';
import type { ActiveProductKey } from 'helpers/productCatalog';
import type { Promotion } from 'helpers/productPrice/promotions';

const containerSummaryTsCs = css`
	border-radius: ${space[2]}px;
	background-color: ${neutral[97]};
	padding: ${space[3]}px;
`;

export function orderSummaryStartDateTierThree(startDateTier3: string) {
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

export function orderSummaryTsAndCs(
	productKey: ActiveProductKey,
	contributionType: ContributionType,
	countryGroupId: CountryGroupId,
	thresholdAmount: number,
	promotion?: Promotion,
) {
	// Proceeds with RegularContributionType only
	if (contributionType === 'ONE_OFF') {
		return;
	}
	const period = contributionType === 'MONTHLY' ? 'month' : 'year';
	switch (productKey) {
		case 'SupporterPlus':
		case 'TierThree':
			return (
				<div css={containerSummaryTsCs}>
					{promotion && (
						<p>
							You’ll pay{' '}
							{productLegal(
								countryGroupId,
								contributionType,
								'/',
								thresholdAmount,
								promotion,
							)}{' '}
							afterwards unless you cancel. Offer only available to new
							subscribers who do not have an existing subscription with the
							Guardian.
						</p>
					)}
					{productKey === 'SupporterPlus' && (
						<>
							<p>Auto renews every {period} until you cancel.</p>
							<p>
								Cancel or change your support anytime. If you cancel within the
								first 14 days, you will receive a full refund.
							</p>
						</>
					)}
					{productKey === 'TierThree' && (
						<p>Auto renews every {period}. Cancel anytime.</p>
					)}
				</div>
			);
		default:
			return (
				<div css={containerSummaryTsCs}>
					<p>Auto renews every {period} until you cancel.</p>
					<p>
						{productKey === 'GuardianAdLite'
							? 'Cancel anytime.'
							: 'Cancel or change your support anytime.'}
					</p>
				</div>
			);
	}
}
