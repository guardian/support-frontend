import { css } from '@emotion/react';
import type { PaperFulfilmentOptions } from '@modules/product/fulfilmentOptions';
import type { PaperProductOptions } from '@modules/product/productOptions';
import type { BenefitsCheckListData } from 'components/checkoutBenefits/benefitsCheckList';

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
};

const digitalRewardsLabel = (
	<>
		Unlock <strong>full digital experience</strong>
	</>
);

const guardianDigitalRewardsTop = [
	<>Unlimited access to the refreshed Guardian app and Guardian Feast app</>,
	<>
		Unlimited access to the Guardian Editions app so you can enjoy newspapers on
		your mobile and tablet
	</>,
];
const guardianDigitalRewardsBottom = [
	<>Ad-free reading on the Guardian app and website</>,
	<>
		Exclusive newsletter for supporters, sent every week from the Guardian
		newsroom
	</>,
	<>Far fewer asks for support</>,
];
const guardianDigitalRewards = [
	...guardianDigitalRewardsTop,
	...guardianDigitalRewardsBottom,
];
const observerDigitalRewards = [
	<>Access to The Observer digital subscription</>,
];
const baseDigitalRewards = [
	...guardianDigitalRewardsTop,
	...observerDigitalRewards,
	...guardianDigitalRewardsBottom,
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

const getBenefitsMap = (
	fulfilmentOption: PaperFulfilmentOptions,
): Partial<Record<PaperProductOptions, Benefits>> => ({
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
});

const digitalBenefitsMap: Partial<
	Record<PaperProductOptions, Benefits | undefined>
> = {
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
	Sunday: { items: observerDigitalRewards },
};

const planDescriptions: Record<
	PaperFulfilmentOptions,
	Partial<Record<PaperProductOptions, JSX.Element>>
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
};

export default function getPlanData(
	ratePlanKey: PaperProductOptions,
	fulfillmentOption: PaperFulfilmentOptions,
): PlanData | undefined {
	const description = planDescriptions[fulfillmentOption][ratePlanKey];
	if (!description) {
		return undefined;
	}

	const benefits = getBenefitsMap(fulfillmentOption)[ratePlanKey];
	if (!benefits) {
		return undefined;
	}

	return {
		description,
		benefits,
		digitalRewards: digitalBenefitsMap[ratePlanKey],
	};
}

export function getPlanBenefitData(
	ratePlanKey: PaperProductOptions,
	fulfillmentOption: PaperFulfilmentOptions,
): BenefitsCheckListData[] | undefined {
	const ratePlanData = getPlanData(ratePlanKey, fulfillmentOption);
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
