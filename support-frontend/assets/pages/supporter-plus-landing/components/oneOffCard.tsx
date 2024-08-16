import { css, ThemeProvider } from '@emotion/react';
import {
	from,
	headline,
	palette,
	space,
	textSans,
	until,
} from '@guardian/source/foundations';
import {
	Button,
	buttonThemeReaderRevenueBrand,
} from '@guardian/source/react-components';
import { OtherAmount } from '../../../components/otherAmount/otherAmount';
import { PriceCards } from '../../../components/priceCards/priceCards';
import { PriceCardsContainer } from '../../../components/priceCards/priceCardsContainer';
import { PaymentCards } from './PaymentIcons';

const sectionStyle = css`
	max-width: 600px;
	margin: auto;
	background-color: ${palette.neutral[100]};
	border-radius: ${space[3]}px;
	padding: 32px 48px ${space[6]}px 48px;
	${until.desktop} {
		padding-top: ${space[6]}px;
	}
`;
const titleStyle = css`
	margin: 0 0 ${space[3]}px;
	text-align: center;
	${headline.xsmall({ fontWeight: 'bold' })}
	${from.tablet} {
		font-size: 22px;
	}
`;
const standFirst = css`
	color: #606060;
	margin-bottom: ${space[2]}px;
	${from.desktop} {
		margin-bottom: ${space[3]}px;
	}
`;

const btnStyleOverrides = css`
	width: 100%;
	justify-content: center;
	margin-bottom: ${space[6]}px;
	margin-top: ${space[6]}px;
`;

const buttonContainer = css`
	display: flex;
	flex-direction: column;
`;

function LandingPageContributionsPriceCards({
	currencyId,
}: {
	currencyId: string;
}): JSX.Element {
	return (
		<div
			css={css`
				${textSans.medium()}
			`}
		>
			<h2 css={titleStyle}>Support just once</h2>
			<p css={standFirst}>
				We welcome support of any size, any time, whether you choose to give{' '}
				{currencyId}1 or much more.
			</p>
			<PriceCardsContainer
				paymentFrequency={'ONE_OFF'}
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

interface Props {
	currencyId: string;
	btnClickHandler: () => void;
}

export function OneOffCard({
	currencyId,
	btnClickHandler,
}: Props): JSX.Element {
	return (
		<section css={sectionStyle}>
			<LandingPageContributionsPriceCards currencyId={currencyId} />
			<div css={buttonContainer}>
				<ThemeProvider theme={buttonThemeReaderRevenueBrand}>
					<Button cssOverrides={btnStyleOverrides} onClick={btnClickHandler}>
						Continue to checkout
					</Button>
				</ThemeProvider>
				<PaymentCards />
			</div>
		</section>
	);
}
