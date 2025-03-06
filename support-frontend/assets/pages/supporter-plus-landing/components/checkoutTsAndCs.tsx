import type { SerializedStyles } from '@emotion/react';
import { css } from '@emotion/react';
import { neutral, textSans12 } from '@guardian/source/foundations';
import { StripeDisclaimer } from 'components/stripe/stripeDisclaimer';
import type { ContributionType } from 'helpers/contributions';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import {
	contributionsTermsLinks,
	guardianAdLiteTermsLink,
	privacyLink,
	supporterPlusTermsLink,
} from 'helpers/legal';
import {
	type ActiveProductKey,
	productCatalogTsAndCs,
} from 'helpers/productCatalog';
import type { Promotion } from 'helpers/productPrice/promotions';
import type { FinePrintTheme } from './finePrint';
import { FinePrint } from './finePrint';

const marginTop = css`
	margin-top: 4px;
`;

const container = css`
	${textSans12};
	color: ${neutral[20]};

	& a {
		color: ${neutral[20]};
	}
`;

const termsSupporterPlus = (linkText: string) => (
	<a href={supporterPlusTermsLink}>{linkText}</a>
);
const termsGuardianAdLite = (linkText: string) => (
	<a href={guardianAdLiteTermsLink}>{linkText}</a>
);

interface CheckoutTsAndCsProps {
	productKey: ActiveProductKey;
	countryGroupId: CountryGroupId;
	contributionType: ContributionType;
	promotion?: Promotion;
	mobileTheme?: FinePrintTheme;
	cssOverrides?: SerializedStyles;
}
export function CheckoutTsAndCs({
	productKey,
	countryGroupId,
	contributionType,
	promotion,
	mobileTheme = 'dark',
}: CheckoutTsAndCsProps): JSX.Element {
	const productTsAndCs = productCatalogTsAndCs(
		productKey,
		countryGroupId,
		contributionType,
		promotion,
	);
	return (
		<div css={container}>
			<FinePrint mobileTheme={mobileTheme}>
				<div>
					{productTsAndCs.map((line) => {
						return (
							<div
								css={marginTop}
								dangerouslySetInnerHTML={{ __html: line.copy }}
							/>
						);
					})}
				</div>
			</FinePrint>
		</div>
	);
}

export function TsAndCsFooterLinks({
	countryGroupId,
	amountIsAboveThreshold,
	productKey,
}: {
	countryGroupId: CountryGroupId;
	amountIsAboveThreshold?: boolean;
	productKey?: ActiveProductKey;
}) {
	const inAdLite = productKey === 'GuardianAdLite';
	const privacy = <a href={privacyLink}>Privacy Policy</a>;

	const termsContributions = (
		<a href={contributionsTermsLinks[countryGroupId]}>Terms and Conditions</a>
	);

	const terms = amountIsAboveThreshold
		? termsSupporterPlus('Terms and Conditions')
		: inAdLite
		? termsGuardianAdLite('Terms')
		: termsContributions;
	const productNameSummary = inAdLite ? 'the Guardian Ad-Lite' : 'our';

	return (
		<div css={marginTop}>
			By proceeding, you are agreeing to {productNameSummary} {terms}.{' '}
			<p css={marginTop}>
				To find out what personal data we collect and how we use it, please
				visit our {privacy}.
			</p>
			<p css={marginTop}>
				<StripeDisclaimer />
			</p>
		</div>
	);
}
