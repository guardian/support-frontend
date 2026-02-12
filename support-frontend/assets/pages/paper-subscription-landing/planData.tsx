import { css } from '@emotion/react';
import type { PrintFulfilmentOptions } from '@modules/product/fulfilmentOptions';
import { type PrintProductOptions } from '@modules/product/productOptions';
import type { BenefitsCheckListData } from 'components/checkoutBenefits/benefitsCheckList';
import { getFeatureFlags } from 'helpers/featureFlags';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';

const benefitStyle = css`
	display: inline-block;
`;

interface Benefits {
	label?: JSX.Element;
	items: JSX.Element[];
}

export type PlanData = {
	description: JSX.Element;
	benefits: Benefits;
	digitalRewards?: Benefits;
};

const benefitsHomeDeliveryLabel = (
	<>
		Enjoy <strong>home delivery</strong> of your newspaper
	</>
);
const benefitsSubscriptionLabel = (
	<>
		Collect in store with a <strong>subscription card</strong>
	</>
);
const benefitsLabel = {
	HomeDelivery: benefitsHomeDeliveryLabel,
	Collection: benefitsSubscriptionLabel,
	Domestic: undefined,
	RestOfWorld: undefined,
};

const digitalRewardsLabel = (
	<>
		Unlock <strong>full digital experience</strong>
	</>
);

const guardianDigitalRewards = [
	<>Unlimited access to the refreshed Guardian app and Guardian Feast app</>,
	<>
		Unlimited access to the Guardian Editions app so you can enjoy newspapers on
		your mobile and tablet
	</>,
	<>Digital access to the Guardian’s 200 year newspaper archive</>,
	<>Ad-free reading on the Guardian app and website</>,
	<>
		Exclusive newsletter for supporters, sent every week from the Guardian
		newsroom
	</>,
	<>Far fewer asks for support</>,
];

const weeklyDigitalRewards = [
	<span css={benefitStyle}>
		Unlimited access to the refreshed&nbsp;<strong>Guardian app</strong>
		&nbsp;and&nbsp;<strong>Guardian Feast app</strong>
	</span>,
	<span css={benefitStyle}>
		Unlimited access to the&nbsp;<strong>Guardian Editions app</strong>&nbsp;so
		you can enjoy newspapers on your mobile and tablet
	</span>,
	<span css={benefitStyle}>
		Digital access to the Guardian’s 200 year&nbsp;
		<strong>newspaper archive</strong>
	</span>,
	<span css={benefitStyle}>
		<strong>Ad-free reading</strong>&nbsp;on the Guardian app and website
	</span>,
	<span css={benefitStyle}>
		<strong>Exclusive newsletter</strong>&nbsp;for supporters, sent every week
		from the Guardian newsroom
	</span>,
	<>Far fewer asks for support</>,
];

const observerDigitalRewards = [
	<>Access to The Observer digital subscription</>,
];
const baseDigitalRewards = [
	...guardianDigitalRewards,
	...observerDigitalRewards,
];

const benefitGuardianSixDay = (
	<span css={benefitStyle}>
		The Guardian and all its supplements <strong>Monday to Saturday</strong>
	</span>
);
const benefitGuardianSaturday = (
	<span css={benefitStyle}>
		<strong>Saturday</strong> edition of The Guardian and all its supplements
	</span>
);
const benefitObserverSunday = (
	<span css={benefitStyle}>
		The Observer on <strong>Sunday</strong>
	</span>
);
const benefitWeekly = (
	<span css={benefitStyle}>
		<strong>Guardian Weekly</strong> magazine delivered to your door
	</span>
);

const getPrintBenefitsMap = (
	fulfilmentOption: PrintFulfilmentOptions,
): Partial<Record<PrintProductOptions, Benefits>> => ({
	EverydayPlus: {
		label: benefitsLabel[fulfilmentOption],
		items: [benefitGuardianSixDay, benefitObserverSunday],
	},
	SixdayPlus: {
		label: benefitsLabel[fulfilmentOption],
		items: [benefitGuardianSixDay],
	},
	WeekendPlus: {
		label: benefitsLabel[fulfilmentOption],
		items: [benefitGuardianSaturday, benefitObserverSunday],
	},
	SaturdayPlus: {
		label: benefitsLabel[fulfilmentOption],
		items: [benefitGuardianSaturday],
	},
	Sunday: {
		label: benefitsLabel[fulfilmentOption],
		items: [benefitObserverSunday],
	},
	NoProductOptions: {
		items: [benefitWeekly],
	},
});

const getPrintDigitalBenefitsMap = (): Partial<
	Record<PrintProductOptions, Benefits>
> => ({
	EverydayPlus: {
		label: digitalRewardsLabel,
		items: baseDigitalRewards,
	},
	SixdayPlus: {
		label: digitalRewardsLabel,
		items: guardianDigitalRewards,
	},
	WeekendPlus: {
		label: digitalRewardsLabel,
		items: baseDigitalRewards,
	},
	SaturdayPlus: {
		label: digitalRewardsLabel,
		items: guardianDigitalRewards,
	},
	Sunday: {
		items: observerDigitalRewards,
	},
	NoProductOptions: {
		items: weeklyDigitalRewards,
	},
});

const printPlanDescriptions: Record<
	PrintFulfilmentOptions,
	Partial<Record<PrintProductOptions, JSX.Element>>
> = {
	Collection: {
		EverydayPlus: (
			<>
				Collect the Guardian and all its supplements{' '}
				<strong>Monday to Saturday</strong> and the Observer on{' '}
				<strong>Sunday</strong> in store with a subscription card
			</>
		),
		SixdayPlus: (
			<>
				Collect the Guardian and all its supplements{' '}
				<strong>Monday to Saturday</strong> in store with a subscription card
			</>
		),
		WeekendPlus: (
			<>
				Collect the Guardian and all its supplements on{' '}
				<strong>Saturday</strong> and the Observer on <strong>Sunday</strong> in
				store with a subscription card
			</>
		),
		SaturdayPlus: (
			<>
				Collect the Guardian and all its supplements on{' '}
				<strong>Saturday</strong> in store with a subscription card
			</>
		),
		Sunday: (
			<>
				Collect the Observer on <strong>Sunday</strong> in store with a
				subscription card
			</>
		),
	},
	HomeDelivery: {
		EverydayPlus: (
			<>
				The Guardian and all its supplements <strong>Monday to Saturday</strong>{' '}
				and the Observer on Sunday delivered to your door
			</>
		),
		SixdayPlus: (
			<>
				The Guardian and all its supplements <strong>Monday to Saturday</strong>{' '}
				delivered to your door
			</>
		),
		WeekendPlus: (
			<>
				The Guardian and all its supplements on <strong>Saturday</strong> and
				the Observer on <strong>Sunday</strong> delivered to your door
			</>
		),
		SaturdayPlus: (
			<>
				The Guardian and all its supplements on <strong>Saturday</strong>{' '}
				delivered to your door
			</>
		),
		Sunday: (
			<>
				The Observer on <strong>Sunday</strong> delivered to your door
			</>
		),
	},
	Domestic: {
		NoProductOptions: <></>,
	},
	RestOfWorld: {
		NoProductOptions: <></>,
	},
};

export default function getPlanData(
	printProductOptions: PrintProductOptions,
	fulfillmentOption: PrintFulfilmentOptions,
): PlanData | undefined {
	const description =
		printPlanDescriptions[fulfillmentOption][printProductOptions];
	if (!description) {
		return undefined;
	}
	const benefits = getPrintBenefitsMap(fulfillmentOption)[printProductOptions];
	if (!benefits) {
		return undefined;
	}
	const digitalRewards = getPrintDigitalBenefitsMap()[printProductOptions];
	return {
		description,
		benefits,
		digitalRewards,
	};
}

const getPrintProductOptions = (
	productKey: ActiveProductKey,
	ratePlanKey: ActiveRatePlanKey,
	enableWeeklyDigital?: boolean,
): PrintProductOptions | undefined => {
	switch (productKey) {
		case 'HomeDelivery':
		case 'SubscriptionCard':
			return ratePlanKey as PrintProductOptions;
		case 'GuardianWeeklyDomestic':
		case 'GuardianWeeklyRestOfWorld':
			return enableWeeklyDigital ? 'NoProductOptions' : undefined;
		default:
			return undefined;
	}
};
const getPrintFulfilmentOption = (
	productKey: ActiveProductKey,
	enableWeeklyDigital?: boolean,
): PrintFulfilmentOptions | undefined => {
	switch (productKey) {
		case 'HomeDelivery':
		case 'NationalDelivery':
			return 'HomeDelivery';
		case 'SubscriptionCard':
			return 'Collection';
		case 'GuardianWeeklyDomestic':
			return enableWeeklyDigital ? 'Domestic' : undefined;
		case 'GuardianWeeklyRestOfWorld':
			return enableWeeklyDigital ? 'RestOfWorld' : undefined;
		default:
			return undefined;
	}
};
export function getPlanBenefitData(
	productKey: ActiveProductKey,
	ratePlanKey: ActiveRatePlanKey,
): BenefitsCheckListData[] | undefined {
	const isWeekly =
		productKey === 'GuardianWeeklyDomestic' ||
		productKey === 'GuardianWeeklyRestOfWorld';
	const isNotGift = !ratePlanKey.includes('Gift');
	const enableWeeklyDigital =
		isWeekly && getFeatureFlags().enableWeeklyDigital && isNotGift;

	const printProductOptions = getPrintProductOptions(
		productKey,
		ratePlanKey,
		enableWeeklyDigital,
	);
	if (!printProductOptions) {
		return undefined;
	}

	const fulfillmentOption = getPrintFulfilmentOption(
		productKey,
		enableWeeklyDigital,
	);
	if (!fulfillmentOption) {
		return undefined;
	}

	const ratePlanData = getPlanData(printProductOptions, fulfillmentOption);
	console.log(
		'*** ratePlanData',
		ratePlanData,
		printProductOptions,
		fulfillmentOption,
	);
	if (!ratePlanData) {
		return undefined;
	}

	const benefits = ratePlanData.benefits.items.map((item) => ({
		text: item,
		isChecked: true,
	}));
	if (ratePlanData.digitalRewards) {
		const digitalBenefits = ratePlanData.digitalRewards.items.map((item) => ({
			text: item,
			isChecked: true,
		}));
		return benefits.concat(digitalBenefits);
	}
	return benefits;
}
