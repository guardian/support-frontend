import { css } from '@emotion/react';
import { neutral, textSans } from '@guardian/source/foundations';
import ThreeTierTerms from 'components/subscriptionCheckouts/threeTierTerms';
import type {
	ContributionType,
	RegularContributionType,
} from 'helpers/contributions';
import { formatAmount } from 'helpers/forms/checkouts';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import {
	currencies,
	spokenCurrencies,
} from 'helpers/internationalisation/currency';
import { contributionsTermsLinks, privacyLink } from 'helpers/legal';
import { productLegal } from 'helpers/legalCopy';
import type { ProductId } from 'helpers/productCatalog';
import type { Promotion } from 'helpers/productPrice/promotions';
import {
	getDateWithOrdinal,
	getLongMonth,
} from 'helpers/utilities/dateFormatting';
import type { FinePrintTheme } from './finePrint';
import { FinePrint } from './finePrint';
import { ManageMyAccountLink } from './manageMyAccountLink';

const marginTop = css`
	margin-top: 4px;
`;

const container = css`
	${textSans.xxsmall()};
	color: ${neutral[20]};

	& a {
		color: ${neutral[20]};
	}
`;

interface PaymentTsAndCsProps {
	mobileTheme?: FinePrintTheme;
	contributionType: ContributionType;
	countryGroupId: CountryGroupId;
	currency: IsoCurrency;
	amount: number;
	amountIsAboveThreshold: boolean;
	productNameAboveThreshold: string;
	promotion?: Promotion;
}

const termsSupporterPlus = (linkText: string) => (
	<a href="https://www.theguardian.com/info/2022/oct/28/the-guardian-supporter-plus-terms-and-conditions">
		{linkText}
	</a>
);

function TsAndCsRenewal({
	contributionType,
}: {
	contributionType: ContributionType;
}): JSX.Element {
	const today = new Date();
	if (contributionType === 'ANNUAL') {
		return (
			<>
				on the {getDateWithOrdinal(today)} day of {getLongMonth(today)} every{' '}
				year
			</>
		);
	}
	return <>on the {getDateWithOrdinal(today)} day of every month</>;
}

function TsAndCsFooterLinks({
	countryGroupId,
	amountIsAboveThreshold,
}: {
	countryGroupId: CountryGroupId;
	amountIsAboveThreshold: boolean;
}) {
	const privacy = <a href={privacyLink}>Privacy Policy</a>;

	const termsContributions = (
		<a href={contributionsTermsLinks[countryGroupId]}>Terms and Conditions</a>
	);

	const terms = amountIsAboveThreshold
		? termsSupporterPlus('Terms and Conditions')
		: termsContributions;

	return (
		<div css={marginTop}>
			By proceeding, you are agreeing to our {terms}.{' '}
			<p css={marginTop}>
				To find out what personal data we collect and how we use it, please
				visit our {privacy}.
			</p>
		</div>
	);
}

export function PaymentTsAndCs({
	mobileTheme = 'dark',
	contributionType,
	countryGroupId,
	currency,
	amount,
	amountIsAboveThreshold,
	productNameAboveThreshold,
	promotion,
}: PaymentTsAndCsProps): JSX.Element {
	const inSupporterPlus =
		productNameAboveThreshold === 'All-access digital' &&
		amountIsAboveThreshold;
	const inTier3 =
		productNameAboveThreshold === 'Digital + print' && amountIsAboveThreshold;
	const inSupport =
		productNameAboveThreshold === 'Support' || !(inSupporterPlus || inTier3);

	const amountCopy = isNaN(amount)
		? null
		: ` of ${formatAmount(
				currencies[currency],
				spokenCurrencies[currency],
				amount,
				false,
		  )}`;

	const frequencySingular = (contributionType: ContributionType) =>
		contributionType === 'MONTHLY' ? 'month' : 'year';

	const frequencyPlural = (contributionType: ContributionType) =>
		contributionType === 'MONTHLY' ? 'monthly' : 'annual';

	const copyAboveThreshold = (
		contributionType: RegularContributionType,
		productNameAboveThreshold: string,
		product: ProductId,
		promotion?: Promotion,
	) => {
		return (
			<>
				<div>
					If you pay at least{' '}
					{productLegal(
						countryGroupId,
						contributionType,
						' per ',
						product,
						promotion,
					)}
					, you will receive the {productNameAboveThreshold} benefits on a
					subscription basis. If you increase your payments per{' '}
					{frequencySingular(contributionType)}, these additional amounts will
					be separate {frequencyPlural(contributionType)} voluntary financial
					contributions to the Guardian. The {productNameAboveThreshold}{' '}
					subscription and any contributions will auto-renew each{' '}
					{frequencySingular(contributionType)}. You will be charged the
					subscription and contribution amounts using your chosen payment method
					at each renewal unless you cancel. You can cancel your subscription or
					change your contributions at any time before your next renewal date.
					If you cancel within 14 days of taking out a{' '}
					{productNameAboveThreshold} subscription, you’ll receive a full refund
					(including of any contributions) and your subscription and any
					contribution will stop immediately. Cancellation of your subscription
					(which will also cancel any contribution) or cancellation of your
					contribution made after 14 days will take effect at the end of your
					current {frequencyPlural(contributionType)} payment period. To cancel,
					go to {ManageMyAccountLink} or see our {termsSupporterPlus('Terms')}.
				</div>
				<TsAndCsFooterLinks
					countryGroupId={countryGroupId}
					amountIsAboveThreshold={amountIsAboveThreshold}
				/>
			</>
		);
	};

	if (contributionType === 'ONE_OFF') {
		return (
			<div css={container}>
				<FinePrint mobileTheme={mobileTheme}>
					<TsAndCsFooterLinks
						countryGroupId={countryGroupId}
						amountIsAboveThreshold={amountIsAboveThreshold}
					/>
				</FinePrint>
			</div>
		);
	}

	const copyBelowThreshold = (contributionType: ContributionType) => {
		return (
			<>
				<div>
					We will attempt to take payment{amountCopy},{' '}
					<TsAndCsRenewal contributionType={contributionType} />, from now until
					you cancel your payment. Payments may take up to 6 days to be recorded
					in your bank account. You can change how much you give or cancel your
					payment at any time.
				</div>
				<TsAndCsFooterLinks
					countryGroupId={countryGroupId}
					amountIsAboveThreshold={amountIsAboveThreshold}
				/>
			</>
		);
	};

	return (
		<div css={container}>
			<FinePrint mobileTheme={mobileTheme}>
				{inTier3 && (
					<ThreeTierTerms
						paymentFrequency={contributionType === 'ANNUAL' ? 'year' : 'month'}
					/>
				)}
				{inSupporterPlus &&
					copyAboveThreshold(
						contributionType,
						productNameAboveThreshold,
						'SupporterPlus',
						promotion,
					)}
				{inSupport && copyBelowThreshold(contributionType)}
			</FinePrint>
		</div>
	);
}
