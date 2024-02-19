import { css } from '@emotion/react';
import { from, headline, space, textSans } from '@guardian/source-foundations';
import { Button } from '@guardian/source-react-components';
import { useNavigate } from 'react-router-dom';
import { OtherAmount } from 'components/otherAmount/otherAmount';
import { PriceCards } from 'components/priceCards/priceCards';
import { PriceCardsContainer } from 'components/priceCards/priceCardsContainer';
import type { ContributionType } from 'helpers/contributions';
import { countryGroups } from 'helpers/internationalisation/countryGroup';
import { resetValidation } from 'helpers/redux/checkout/checkoutActions';
import {
	useContributionsDispatch,
	useContributionsSelector,
} from 'helpers/redux/storeHooks';
import { navigateWithPageView } from 'helpers/tracking/ophan';

const titleAndButtonContainer = css`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin: 6px 0 ${space[3]}px;
	${from.desktop} {
		margin-bottom: 0;
	}
`;

const title = css`
	${headline.xsmall({ fontWeight: 'bold' })}
	${from.tablet} {
		font-size: 28px;
	}
`;

const standFirst = css`
	color: #606060;
	margin-bottom: ${space[2]}px;
	${from.desktop} {
		margin-bottom: ${space[3]}px;
	}
`;

interface ContributionsPriceCardsProps {
	paymentFrequency: ContributionType;
}

export function ContributionsPriceCards({
	paymentFrequency,
}: ContributionsPriceCardsProps): JSX.Element {
	const dispatch = useContributionsDispatch();
	const { abParticipations } = useContributionsSelector(
		(state) => state.common,
	);
	const { countryGroupId } = useContributionsSelector(
		(state) => state.common.internationalisation,
	);
	const navigate = useNavigate();

	const backButton = (
		<Button
			priority="tertiary"
			size="xsmall"
			onClick={() => {
				dispatch(resetValidation());
				const destination = `/${countryGroups[countryGroupId].supportInternationalisationId}/contribute`;
				navigateWithPageView(navigate, destination, abParticipations);
			}}
		>
			back
		</Button>
	);

	return (
		<div
			css={css`
				${textSans.medium()}
			`}
		>
			<div css={titleAndButtonContainer}>
				<h2 css={title}>
					{paymentFrequency === 'ONE_OFF'
						? 'Support just once'
						: 'Your subscription'}
				</h2>
				{backButton}
			</div>
			<p css={standFirst}>Support us with the amount of your choice.</p>
			<PriceCardsContainer
				paymentFrequency={paymentFrequency}
				renderPriceCards={({
					amounts,
					selectedAmount,
					otherAmount,
					currency,
					paymentInterval,
					onAmountChange,
					minAmount,
					onOtherAmountChange,
					hideChooseYourAmount,
					errors,
				}) => (
					<PriceCards
						amounts={amounts}
						selectedAmount={selectedAmount}
						currency={currency}
						paymentInterval={paymentInterval}
						onAmountChange={onAmountChange}
						hideChooseYourAmount={hideChooseYourAmount}
						otherAmountField={
							<OtherAmount
								currency={currency}
								minAmount={minAmount}
								selectedAmount={selectedAmount}
								otherAmount={otherAmount}
								onOtherAmountChange={onOtherAmountChange}
								errors={errors}
							/>
						}
					/>
				)}
			/>
		</div>
	);
}
