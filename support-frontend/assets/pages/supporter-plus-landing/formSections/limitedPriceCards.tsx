import { css } from '@emotion/react';
import { textSans } from '@guardian/source-foundations';
import { useEffect } from 'react';
import type { CheckListData } from 'components/checkList/checkList';
import { CheckList } from 'components/checkList/checkList';
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
	setSelectedAmount,
	setSelectedAmountBeforeAmendment,
} from 'helpers/redux/checkout/product/actions';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import {
	useContributionsDispatch,
	useContributionsSelector,
} from 'helpers/redux/storeHooks';
import {
	getLowerBenefitsThreshold,
	getLowerBenefitsThresholds,
} from 'helpers/supporterPlus/benefitsThreshold';

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
					<span css={boldText}>A regular supporter newsletter. </span>Get
					exclusive insight from our newsroom
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
		// The contribution type will be set by the query param to be either MONTHLY or ANNUAL, but we
		// need to eliminate ONE_OFF for the type check
		const type = contributionType !== 'ONE_OFF' ? contributionType : 'ANNUAL';
		dispatch(
			setSelectedAmount({
				contributionType,
				amount: getLowerBenefitsThreshold(countryGroupId, type).toString(),
			}),
		);
		dispatch(
			setSelectedAmountBeforeAmendment({
				contributionType,
				amount: getLowerBenefitsThreshold(countryGroupId, type).toString(),
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
						paymentFrequency={contributionType}
						renderPriceCards={({ selectedAmount }) => (
							<SimplePriceCards
								title="Support Guardian journalism"
								subtitle="and&nbsp;unlock exclusive extras"
								contributionType={selectedTab}
								countryGroupId={countryGroupId}
								prices={getLowerBenefitsThresholds(countryGroupId)}
								onPriceChange={({ contributionType, amount }) => {
									onTabChange(contributionType);
									dispatch(
										setSelectedAmount({
											contributionType,
											amount: amount.toString(),
										}),
									);
									dispatch(
										setSelectedAmountBeforeAmendment({
											contributionType,
											amount: amount.toString(),
										}),
									);
								}}
							>
								<div>
									<h3 css={accordionHeading}>Exclusive extras include:</h3>
									<div css={listSpacing}>
										<CheckList
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
