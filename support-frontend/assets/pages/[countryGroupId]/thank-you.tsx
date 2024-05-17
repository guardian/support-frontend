import { css } from '@emotion/react';
import { storage } from '@guardian/libs';
import { from, space, sport } from '@guardian/source-foundations';
import { Container, LinkButton } from '@guardian/source-react-components';
import { FooterWithContents } from '@guardian/source-react-components-development-kitchen';
import type { Input } from 'valibot';
import { number, object, safeParse, string } from 'valibot';
import { Header } from 'components/headers/simpleHeader/simpleHeader';
import { PageScaffold } from 'components/page/pageScaffold';
import { init as abTestInit } from 'helpers/abTests/abtest';
import CountryHelper from 'helpers/internationalisation/classes/country';
import { get } from 'helpers/storage/cookie';
import { OPHAN_COMPONENT_ID_RETURN_TO_GUARDIAN } from 'helpers/thankYouPages/utils/ophan';
import { trackComponentClick } from 'helpers/tracking/behaviour';
import { type GeoId, getGeoIdConfig } from 'pages/geoIdConfig';
import ThankYouFooter from 'pages/supporter-plus-thank-you/components/thankYouFooter';
import ThankYouHeader from 'pages/supporter-plus-thank-you/components/thankYouHeader/thankYouHeader';

export const checkoutContainer = css`
	${from.tablet} {
		background-color: ${sport[800]};
	}
`;

export const headerContainer = css`
	${from.desktop} {
		width: 60%;
	}
	${from.leftCol} {
		width: calc(50% - ${space[3]}px);
	}
`;

export const buttonContainer = css`
	padding: ${space[12]}px 0;
`;

/**
 * The checkout page sets the order in sessionStorage
 * And the thank-you page reads it.
 */
const OrderSchema = object({
	firstName: string(),
	price: number(),
	product: string(),
	ratePlan: string(),
	paymentMethod: string(),
});
export function setThankYouOrder(order: Input<typeof OrderSchema>) {
	storage.session.set('thankYouOrder', order);
}
export function unsetThankYouOrder() {
	storage.session.remove('thankYouOrder');
}

type Props = {
	geoId: GeoId;
};
export function ThankYou({ geoId }: Props) {
	const countryId = CountryHelper.fromString(get('GU_country') ?? 'GB') ?? 'GB';
	const isSignedIn = !!get('GU_U');
	const { countryGroupId, currencyKey } = getGeoIdConfig(geoId);

	const sessionStorageOrder = storage.session.get('thankYouOrder');
	const parsedOrder = safeParse(
		OrderSchema,
		storage.session.get('thankYouOrder'),
	);

	if (!parsedOrder.success) {
		return (
			<div>Unable to read your order {JSON.stringify(sessionStorageOrder)}</div>
		);
	}

	const order = parsedOrder.output;
	// Soon we'll remove this be using billingPeriod from the API
	const contributionType =
		order.ratePlan === 'Monthly'
			? 'MONTHLY'
			: order.ratePlan === 'Annual'
			? 'ANNUAL'
			: order.product === 'Contribution'
			? 'ONE_OFF'
			: undefined;

	if (!contributionType) {
		return <div>Unable to find contribution type {contributionType}</div>;
	}

	const isOneOffPayPal =
		order.paymentMethod === 'PayPal' && order.product === 'Contribution';

	const abParticipations = abTestInit({ countryId, countryGroupId });
	const showOffer =
		!!abParticipations.usFreeBookOffer && order.product === 'SupporterPlus';

	return (
		<PageScaffold
			header={<Header />}
			footer={
				<FooterWithContents>
					<ThankYouFooter />
				</FooterWithContents>
			}
		>
			<div css={checkoutContainer}>
				<Container>
					<div css={headerContainer}>
						<ThankYouHeader
							isSignedIn={isSignedIn}
							name={order.firstName}
							amount={order.price}
							contributionType={contributionType}
							amountIsAboveThreshold={order.product === 'SupporterPlus'}
							isOneOffPayPal={isOneOffPayPal}
							showDirectDebitMessage={order.paymentMethod === 'DirectDebit'}
							currency={currencyKey}
							showOffer={showOffer}
							// TODO - generic checkout support promotions
							promotion={undefined}
							// TODO - get this from the /identity/get-user-type endpoint
							userTypeFromIdentityResponse={'guest'}
						/>

						<div css={buttonContainer}>
							<LinkButton
								href="https://www.theguardian.com"
								priority="tertiary"
								onClick={() =>
									trackComponentClick(OPHAN_COMPONENT_ID_RETURN_TO_GUARDIAN)
								}
							>
								Return to the Guardian
							</LinkButton>
						</div>
					</div>
				</Container>
			</div>
		</PageScaffold>
	);
}
