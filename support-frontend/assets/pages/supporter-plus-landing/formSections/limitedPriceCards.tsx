import { css } from '@emotion/react';
import { textSans } from '@guardian/source-foundations';
import { useEffect } from 'react';
import type { CheckListData } from 'components/checkmarkList/checkmarkList';
import { CheckmarkList } from 'components/checkmarkList/checkmarkList';
import { BoxContents } from 'components/checkoutBox/checkoutBox';
import { CheckoutErrorSummary } from 'components/errorSummary/errorSummary';
import { CheckoutErrorSummaryContainer } from 'components/errorSummary/errorSummaryContainer';
import { InfoBlock } from 'components/infoBlock/infoBlock';
import { PaymentFrequencyTabsContainer } from 'components/paymentFrequencyTabs/paymentFrequencyTabsContainer';
import { PriceCardsContainer } from 'components/priceCards/priceCardsContainer';
import { SimplePriceCards } from 'components/priceCards/simplePriceCards';
import {
	fromCountryGroupId,
	glyph,
} from 'helpers/internationalisation/currency';
import {
	setProductType,
	setSelectedAmount,
} from 'helpers/redux/checkout/product/actions';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import {
	useContributionsDispatch,
	useContributionsSelector,
} from 'helpers/redux/storeHooks';
import { benefitsThresholdsByCountryGroup } from 'helpers/supporterPlus/benefitsThreshold';

const accordionHeading = css`
	${textSans.small()};
	color: #606060;
	margin-bottom: 10px;
`;

const listSpacing = css`
	margin-bottom: 16px;
`;

const infoBlockHeading = css`
	display: flex;
	justify-content: space-between;
`;

const boldText = css`
	font-weight: 700;
`;

const testCheckListData = (): CheckListData[] => {
	return [
		{
			isChecked: true,
			text: (
				<p>
					<span css={boldText}>A regular supporter newsletter. </span>Get
					exclusive insight from our newsroom
				</p>
			),
		},
		{
			isChecked: true,
			text: (
				<p>
					<span css={boldText}>Uninterrupted reading. </span> See far fewer asks
					for support
				</p>
			),
		},
		{
			isChecked: true,
			text: (
				<p>
					<span css={boldText}>Full access to the Guardian app. </span>Enjoy
					unlimited articles and enhanced offline reading
				</p>
			),
		},
		{
			isChecked: true,
			text: (
				<p>
					<span css={boldText}>Ad-free reading. </span>Avoid ads on all your
					devices
				</p>
			),
		},
	];
};

export function LimitedPriceCards(): JSX.Element {
	const dispatch = useContributionsDispatch();
	const { countryGroupId } = useContributionsSelector(
		(state) => state.common.internationalisation,
	);

	const contributionType = useContributionsSelector(getContributionType);

	useEffect(() => {
		dispatch(setProductType('ANNUAL'));
		dispatch(
			setSelectedAmount({
				contributionType: 'ANNUAL',
				amount:
					benefitsThresholdsByCountryGroup[countryGroupId].ANNUAL.toString(),
			}),
		);
	}, []);

	return (
		<PaymentFrequencyTabsContainer
			render={({ onTabChange, selectedTab }) => (
				<BoxContents>
					<CheckoutErrorSummaryContainer
						renderSummary={({ errorList }) => (
							<CheckoutErrorSummary errorList={errorList} />
						)}
					/>
					<PriceCardsContainer
						frequency={contributionType}
						renderPriceCards={({ selectedAmount }) => (
							<SimplePriceCards
								title="Support Guardian journalism"
								subtitle="and unlock exclusive extras"
								contributionType={selectedTab}
								countryGroupId={countryGroupId}
								prices={benefitsThresholdsByCountryGroup[countryGroupId]}
								onPriceChange={({ contributionType, amount }) => {
									onTabChange(contributionType);
									dispatch(
										setSelectedAmount({
											contributionType,
											amount: amount.toString(),
										}),
									);
								}}
							>
								<div>
									<h2 css={accordionHeading}>Exclusive extras include:</h2>
									<div css={listSpacing}>
										<CheckmarkList
											checkListData={testCheckListData()}
											style="compact"
										/>
									</div>
									<InfoBlock
										header={
											<h3 css={infoBlockHeading}>
												<span>Total due today</span>
												{''}
												<strong css={boldText}>
													{glyph(fromCountryGroupId(countryGroupId))}
													{selectedAmount}
												</strong>
											</h3>
										}
										content={
											<p>
												Cancel or change your support anytime. If you cancel
												within the first 14 days, you will receive a full
												refund.
											</p>
										}
									/>
								</div>
							</SimplePriceCards>
						)}
					/>
				</BoxContents>
			)}
		/>
	);
}
