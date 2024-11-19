import { css } from '@emotion/react';
import { from, palette, space } from '@guardian/source/foundations';
import {
	Accordion,
	AccordionRow,
	Container,
} from '@guardian/source/react-components';
import { Box } from 'components/checkoutBox/checkoutBox';
import { productCatalogGuardianLight } from 'helpers/productCatalog';
import type { GeoId } from 'pages/geoIdConfig';
import { getGeoIdConfig } from 'pages/geoIdConfig';
import { CheckoutLayout } from './components/checkoutLayout';
import { GuardianLightCards } from './components/guardianLightCards';

type GuardianLightLandingProps = {
	geoId: GeoId;
};

const recurringContainer = css`
	background-color: ${palette.brand[400]};
	border-bottom: 1px solid ${palette.brand[600]};
	> div {
		padding: ${space[2]}px 10px ${space[4]}px;
	}
	${from.mobileLandscape} {
		> div {
			padding: ${space[2]}px ${space[5]}px ${space[4]}px;
		}
	}
	${from.tablet} {
		border-bottom: none;
		> div {
			padding: ${space[2]}px 10px ${space[4]}px;
		}
	}
	${from.desktop} {
		> div {
			padding: 40px 10px 72px;
		}
	}
`;

export function GuardianLightLanding({
	geoId,
}: GuardianLightLandingProps): JSX.Element {
	const { currencyKey, countryGroupId } = getGeoIdConfig(geoId);

	const card1UrlParams = new URLSearchParams({
		product: 'GuardianLight',
		ratePlan: 'Monthly',
		contribution: '1',
	});
	const card1Link = `checkout?${card1UrlParams.toString()}`;
	const card1 = {
		link: card1Link,
		productDescription: productCatalogGuardianLight().GuardianLight,
		ctaCopy: 'Get Guardian Light for £X/month',
		price: 1,
	};

	const card2 = {
		link: card1Link,
		productDescription: productCatalogGuardianLight().GuardianLightGoBack,
		ctaCopy: 'Go back to "accept all"',
		price: 2,
	};

	return (
		<CheckoutLayout>
			<Box>
				<div>
					GuardianLightLanding ${currencyKey} ${countryGroupId}
				</div>
			</Box>
			<Container
				sideBorders
				topBorder
				borderColor="rgba(170, 170, 180, 0.5)"
				cssOverrides={recurringContainer}
			>
				<GuardianLightCards cardsContent={[card1, card2]} />
			</Container>
			<Container sideBorders borderColor="rgba(170, 170, 180, 0.5)">
				<Accordion>
					<AccordionRow label="Collecting from multiple newsagents">
						Present your card to a newsagent each time you collect the paper.
						The newsagent will scan your card and will be reimbursed for each
						transaction automatically.
					</AccordionRow>
					<AccordionRow label="Delivery from your retailer">
						Simply give your preferred store / retailer the barcode printed on
						your subscription letter.
					</AccordionRow>
				</Accordion>
			</Container>
		</CheckoutLayout>
	);
}
