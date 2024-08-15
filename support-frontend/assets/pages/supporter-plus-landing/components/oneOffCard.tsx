import { css, ThemeProvider } from '@emotion/react';
import {
  from,
  palette,
  space,
  textSans,
  until,
  headline,
} from '@guardian/source/foundations';
import {ContributionsPriceCards} from "./contributionsPriceCards";
import {PriceCardsContainer} from "../../../components/priceCards/priceCardsContainer";
import {PriceCards} from "../../../components/priceCards/priceCards";
import {OtherAmount} from "../../../components/otherAmount/otherAmount";

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
const titleAndButtonContainer = css`
  display: flex;
  text-align: center;
	justify-content: space-between;
	align-items: center;
	margin: 6px 0 ${space[3]}px;
	${from.desktop} {
		margin-bottom: 0;
	}
`
const titleStyle = css`
  margin: 0 0 ${space[3]}px;
  text-align: center;
  ${headline.xsmall({ fontWeight: 'bold' })}
	${from.tablet} {
		font-size: 22px;
	}
`
const standFirst = css`
	color: #606060;
	margin-bottom: ${space[2]}px;
	${from.desktop} {
		margin-bottom: ${space[3]}px;
	}
`;

function ContributionsPriceCards(): JSX.Element {
  return (
    <div
      css={css`
				${textSans.medium()}
			`}
    >
      <h2 css={titleStyle}>
          Support just once
      </h2>
      <p css={standFirst}>We welcome support of any size, any time, whether you choose to give $1 or much more.</p>
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

export function OneOffCard({}): JSX.Element {
  return (
    <section css={sectionStyle}>
      <ContributionsPriceCards paymentFrequency="ONE_OFF" />
    </section>
  );
}
