import { css } from '@emotion/react';
import { neutral, space, textSans12 } from '@guardian/source/foundations';
import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import type { PaperFulfilmentOptions } from '@modules/product/fulfilmentOptions';
import {
	buildPromotionalTermsLink,
	digitalPlusTermsLink,
	guardianAdLiteTermsLink,
	guardianWeeklyTermsLink,
	manageAccountLink,
	observerLinks,
	supporterPlusTermsLink,
	tierThreeTermsLink,
} from 'helpers/legal';
import { productLegal } from 'helpers/legalCopy';
import { getProductLabel } from 'helpers/productCatalog';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import type { ActivePaperProductOptions } from 'helpers/productCatalogToProductOption';
import {
	getBillingPeriodNoun,
	getBillingPeriodTitle,
	ratePlanToBillingPeriod,
} from 'helpers/productPrice/billingPeriods';
import type { Promotion } from 'helpers/productPrice/promotions';
import { getHelpCentreUrl } from 'helpers/urls/externalLinks';
import { formatUserDate } from 'helpers/utilities/dateConversions';
import { getProductFirstDeliveryDate } from 'pages/[countryGroupId]/checkout/helpers/deliveryDays';
import { isSundayOnlyNewspaperSub } from 'pages/[countryGroupId]/helpers/isSundayOnlyNewspaperSub';
import type { StudentDiscount } from 'pages/[countryGroupId]/student/helpers/discountDetails';
import { isGuardianWeeklyGiftProduct } from 'pages/supporter-plus-thank-you/components/thankYouHeader/utils/productMatchers';
import { textLink } from '../../../helpers/utilities/textLink';
import { FinePrint } from './finePrint';
import { FooterTsAndCs } from './footerTsAndCs';
import { ManageMyAccountLink } from './manageMyAccountLink';

const marginTop = css`
	margin-top: ${space[1]}px;
`;
const container = css`
	${textSans12};
	color: ${neutral[20]};
	& a {
		color: ${neutral[20]};
		:visited {
			color: ${neutral[20]};
		}
	}
`;

const tierThreeLabel = getProductLabel('TierThree');

function getStudentPrice(
	isStudentOneYearRatePlan: boolean,
	studentDiscount: StudentDiscount,
): string {
	const studentPricePeriod = `${studentDiscount.discountPriceWithCurrency} per ${studentDiscount.periodNoun}`;
	return isStudentOneYearRatePlan
		? studentDiscount.discountPriceWithCurrency
		: studentPricePeriod;
}

const printShareTsAndCs =
	'We will share your contact and subscription details with our fulfilment partners';
function paperTsAndCs(
	paperFulfilmentOption: PaperFulfilmentOptions,
	deliveryDate?: Date,
): JSX.Element {
	const noDateTsAndCs = `Your first payment will be taken on the ${
		paperFulfilmentOption === 'HomeDelivery'
			? 'day you receive your first newspaper'
			: 'expected delivery date of the subscription card'
	}.`;
	const deliveryTsAndCs = deliveryDate
		? `Your first payment will be taken on ${formatUserDate(deliveryDate)}${
				paperFulfilmentOption === 'HomeDelivery'
					? ' when your first newspaper is delivered'
					: ''
		  }.`
		: noDateTsAndCs;

	return (
		<>
			<div
				css={css`
					margin-bottom: ${space[1]}px;
				`}
			>
				{deliveryTsAndCs} You can cancel your subscription at any time before
				your next renewal date. Cancellation will take effect at the end of your
				current payment period. To cancel, use the contact details listed on our{' '}
				{textLink('Help Centre', getHelpCentreUrl())}.{' '}
			</div>
			<div>
				{printShareTsAndCs}
				{paperFulfilmentOption === 'Collection'
					? ' to provide you with your subscription card'
					: ''}
				.
			</div>
		</>
	);
}
const rightReservation = `Offer subject to availability. Guardian News and Media Ltd ("GNM") reserves the right to withdraw this promotion at any time. `;
function weeklyTsAndCs(
	isWeeklyGift?: boolean,
	promotion?: Promotion,
	deliveryDate?: Date,
	isWeeklyDigital?: boolean,
): JSX.Element {
	return (
		<>
			{isWeeklyGift && !promotion && <div>{rightReservation}</div>}
			{promotion && <GuardianWeeklyPromoTerms promotion={promotion} />}
			{isWeeklyDigital && (
				<>
					<GuardianWeeklyPaymentTerms deliveryDate={deliveryDate} />
					<div css={marginTop}>{printShareTsAndCs}</div>
				</>
			)}
		</>
	);
}
function GuardianWeeklyPromoTerms({ promotion }: { promotion: Promotion }) {
	return (
		<div>
			{rightReservation}Full promotion terms and conditions for our{' '}
			{textLink('offer', buildPromotionalTermsLink(promotion))}.
		</div>
	);
}
function GuardianWeeklyPaymentTerms({ deliveryDate }: { deliveryDate?: Date }) {
	const deliveryTsAndCs = `Your first payment will be taken on ${
		deliveryDate ? formatUserDate(deliveryDate) : 'the delivery date'
	}.`;
	return (
		<div css={marginTop}>
			{deliveryTsAndCs} You can cancel your subscription at any time before your
			next renewal date. If you cancel within 14 days of sign-up, you’ll receive
			a full refund. To cancel within 14 days sign-up and receive a refund
			contact: Customer Service. Cancellation of your subscription after 14 days
			will take effect at the end of your current payment period. To cancel,
			contact Customer Service or see our{' '}
			{textLink('Terms', guardianWeeklyTermsLink)}.
		</div>
	);
}

export interface PaymentTsAndCsProps {
	productKey: ActiveProductKey;
	ratePlanKey: ActiveRatePlanKey;
	countryGroupId: CountryGroupId;
	studentDiscount?: StudentDiscount;
	promotion?: Promotion;
	thresholdAmount?: number;
	enableWeeklyDigital?: boolean;
}
export function PaymentTsAndCs({
	productKey,
	ratePlanKey,
	countryGroupId,
	studentDiscount,
	promotion,
	thresholdAmount = 0,
	enableWeeklyDigital,
}: PaymentTsAndCsProps): JSX.Element {
	// Display for AUS Students who are on a subscription basis
	const isStudentOneYearRatePlan = ratePlanKey === 'OneYearStudent';
	const billingPeriod = ratePlanToBillingPeriod(ratePlanKey);
	const billingPeriodSingular = getBillingPeriodNoun(billingPeriod);
	const billingPeriodPlural =
		getBillingPeriodTitle(billingPeriod).toLowerCase();
	const isSundayOnlyNewsletterSubscription = isSundayOnlyNewspaperSub(
		productKey,
		ratePlanKey,
	);
	const deliveryDate = getProductFirstDeliveryDate(
		productKey,
		ratePlanKey as ActivePaperProductOptions,
	);
	const isWeeklyGift = isGuardianWeeklyGiftProduct(productKey, ratePlanKey);

	if (isSundayOnlyNewsletterSubscription) {
		return (
			<div css={container}>
				The Observer is owned by Tortoise Media. By proceeding, you agree to
				Tortoise Media’s {textLink('Terms & Conditions', observerLinks.TERMS)}.
				We will share your contact and subscription details with our fulfilment
				partners to provide you with your subscription card. To find out more
				about what personal data Tortoise Media will collect and how it will be
				used, please visit Tortoise Media’s{' '}
				{textLink('Privacy Policy', observerLinks.PRIVACY)}.
			</div>
		);
	}

	const legalPrice = (divider: string) =>
		studentDiscount
			? getStudentPrice(isStudentOneYearRatePlan, studentDiscount)
			: productLegal(
					countryGroupId,
					billingPeriod,
					divider,
					thresholdAmount,
					promotion,
			  );

	const productLabel = getProductLabel(productKey);

	const accountAndTermsLCopyAndLinks = (
		<>
			To cancel, go to {ManageMyAccountLink} or see our{' '}
			{textLink('Terms', supporterPlusTermsLink)}
		</>
	);

	const prefixBasis = (
		countryGroupId: CountryGroupId,
		promotion?: Promotion,
	) => {
		const startPhrase = `If you pay at least ${legalPrice(' per ')}`;
		const midPhrase =
			countryGroupId === 'UnitedStates' && !!promotion ? ' thereafter,' : ',';
		return `${startPhrase}${midPhrase} you will receive the ${productLabel} benefits on a subscription basis.`;
	};
	const supportBasis = `For support of ${legalPrice(
		' or more per ',
	)}, you will receive the ${productLabel} benefits`;

	const supporterPlusTsAndCs = (
		countryGroupId: CountryGroupId,
		promotion?: Promotion,
	): JSX.Element => {
		return countryGroupId === 'UnitedStates' ? (
			promotion ? (
				<div>
					{prefixBasis(countryGroupId, promotion)} If you give additional
					support beyond {productLabel}, that amount will be charged separately
					as voluntary contributions to the Guardian. If you cancel within 14
					days of subscribing, you’ll receive a full refund (including any
					contributions) and your subscription will immediately stop.
				</div>
			) : (
				<div>
					{supportBasis} on a subscription basis. If you increase your support,
					the additional amount will be charged separately as voluntary
					contributions to the Guardian. If you cancel within 14 days of
					subscribing, you’ll receive a full refund (including any
					contributions) and your subscription will immediately stop.
				</div>
			)
		) : (
			<div>
				{prefixBasis(countryGroupId)} If you increase your payments per{' '}
				{billingPeriodSingular}, these additional amounts will be separate{' '}
				{billingPeriodPlural} voluntary financial contributions to the Guardian.
				The {productLabel} subscription and any contributions will auto-renew
				each {billingPeriodSingular}. You will be charged the subscription and
				contribution amounts using your chosen payment method at each renewal
				unless you cancel. You can cancel your subscription or change your
				contributions at any time before your next renewal date. If you cancel
				within 14 days of taking out a {productLabel} subscription, you’ll
				receive a full refund (including of any contributions) and your
				subscription and any contribution will stop immediately. Cancellation of
				your subscription (which will also cancel any contribution) or
				cancellation of your contribution made after 14 days will take effect at
				the end of your current {billingPeriodPlural} payment period.{' '}
				{accountAndTermsLCopyAndLinks}.
			</div>
		);
	};

	const studentSupporterPlusTsAndCs: JSX.Element = (
		<>
			You may cancel your {getProductLabel('SupporterPlus')} subscription within
			14 days of taking out the subscription. If you do, you'll receive a full
			refund and your subscription will stop immediately.{' '}
			{accountAndTermsLCopyAndLinks}. This subscription does not auto-renew.
		</>
	);

	const digitalSubscriptionTsAndCs = (
		countryGroupId: CountryGroupId,
		promotion?: Promotion,
	): JSX.Element => {
		return countryGroupId === 'UnitedStates' ? (
			promotion ? (
				<div>
					{prefixBasis(countryGroupId, promotion)} Your first payment will be
					taken on day 15 after signing up but you can access your benefits
					straight away. Unless you cancel, each {billingPeriodPlural} payment
					will be taken on this date using your chosen payment method. You can
					cancel your subscription at any time before your next renewal date. If
					you cancel your subscription within 14 days of signing up, your
					subscription will stop immediately and we will not take the first
					payment from you. Cancellation of your subscription after 14 days will
					take effect at the end of your current {billingPeriodPlural} payment
					period. To cancel, go to Manage My Account or see our Terms.
				</div>
			) : (
				<div>
					{supportBasis}. Your first payment will be taken on day 15 after
					signing up but you can access your benefits straight away. Unless you
					cancel, each {billingPeriodPlural} payment will be taken on this date
					using your chosen payment method. You can cancel your subscription at
					any time before your next renewal date. If you cancel your
					subscription within 14 days of signing up, your subscription will stop
					immediately and we will not take the first payment from you.
					Cancellation of your subscription after 14 days will take effect at
					the end of your current {billingPeriodPlural} payment period. To
					cancel, go to {textLink('Manage My Account', manageAccountLink)} or
					see our {textLink('Terms', digitalPlusTermsLink)}.
				</div>
			)
		) : (
			<div>
				Your first payment will be taken on day 15 after signing up but you can
				access your benefits straight away. Unless you cancel, each{' '}
				{billingPeriod.toLocaleLowerCase()} payment will be taken on this date
				using your chosen payment method. You can cancel your subscription at
				any time before your next renewal date. If you cancel your subscription
				within 14 days of signing up, your subscription will stop immediately
				and we will not take the first payment from you. Cancellation of your
				subscription after 14 days will take effect at the end of your current{' '}
				{billingPeriod.toLocaleLowerCase()} payment period. To cancel, go to{' '}
				{textLink('Manage My Account', manageAccountLink)} or see our{' '}
				{textLink('Terms', digitalPlusTermsLink)}.
			</div>
		);
	};

	const paymentTsAndCs: Partial<Record<ActiveProductKey, JSX.Element>> = {
		DigitalSubscription: digitalSubscriptionTsAndCs(countryGroupId, promotion),
		GuardianAdLite: (
			<div>
				Your Guardian Ad-Lite subscription will auto-renew each{' '}
				{billingPeriodSingular} unless cancelled. Your first payment will be
				taken on day 15 after signing up but you will start to receive your
				Guardian Ad-Lite benefits when you sign up. Unless you cancel,
				subsequent monthly payments will be taken on this date using your chosen
				payment method. You can cancel your subscription at any time before your
				next renewal date. If you cancel your Guardian Ad-Lite subscription
				within 14 days of signing up, your subscription will stop immediately
				and we will not take the first payment from you. Cancellation of your
				subscription after 14 days will take effect at the end of your current
				monthly payment period. To cancel, go to {ManageMyAccountLink} or see
				our Guardian Ad-Lite {textLink('Terms', guardianAdLiteTermsLink)}.
			</div>
		),
		SupporterPlus: (
			<div>
				{isStudentOneYearRatePlan
					? studentSupporterPlusTsAndCs
					: supporterPlusTsAndCs(countryGroupId, promotion)}
			</div>
		),
		TierThree: (
			<div>
				<p>
					By signing up, you are taking out a {tierThreeLabel} subscription.
					Your {tierThreeLabel} subscription will auto-renew each{' '}
					{billingPeriodSingular} unless cancelled. Your first payment will be
					taken on the publication date of your first Guardian Weekly magazine
					(as shown in the checkout) but you will start to receive your digital
					benefits when you sign up. Unless you cancel, subsequent{' '}
					{billingPeriodPlural} payments will be taken on this date using your
					chosen payment method. You can cancel your {tierThreeLabel}{' '}
					subscription at any time before your next renewal date. If you cancel
					your {tierThreeLabel} subscription within 14 days of signing up, your
					subscription will stop immediately and we will not take the first
					payment from you. Cancellation of your subscription after 14 days will
					take effect at the end of your current {billingPeriodPlural} payment
					period. To cancel go to&nbsp;
					{ManageMyAccountLink} or see our {tierThreeLabel}{' '}
					{textLink('Terms', tierThreeTermsLink)}.
				</p>
			</div>
		),
		NationalDelivery: paperTsAndCs('HomeDelivery', deliveryDate),
		HomeDelivery: paperTsAndCs('HomeDelivery', deliveryDate),
		SubscriptionCard: paperTsAndCs('Collection', deliveryDate),
		GuardianWeeklyDomestic: weeklyTsAndCs(
			isWeeklyGift,
			promotion,
			deliveryDate,
			enableWeeklyDigital,
		),
		GuardianWeeklyRestOfWorld: weeklyTsAndCs(
			isWeeklyGift,
			promotion,
			deliveryDate,
			enableWeeklyDigital,
		),
	};
	return (
		<div css={container}>
			<FinePrint mobileTheme={'dark'}>
				{paymentTsAndCs[productKey]}
				<FooterTsAndCs
					productKey={productKey}
					ratePlanKey={ratePlanKey}
					countryGroupId={countryGroupId}
				/>
			</FinePrint>
		</div>
	);
}
