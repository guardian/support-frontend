import { css } from '@emotion/react';
import type { PaperFulfilmentOptions } from '@modules/product/fulfilmentOptions';
import type { PaperProductOptions } from '@modules/product/productOptions';
import type { BenefitsCheckListData } from 'components/checkoutBenefits/benefitsCheckList';

const benefitStyle = css`
	display: inline-block;
`;

export type PlanData = {
	description: JSX.Element;
	benefits: {
		label: JSX.Element;
		items: JSX.Element[];
	};
	digitalRewards?: {
		label: JSX.Element;
		items: JSX.Element[];
	};
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

const baseDigitalRewards = [
	<>Unlimited access to the refreshed Guardian app and Guardian Feast app</>,
	<>
		Unlimited access to the Guardian Editions app so you can enjoy newspapers on
		your mobile and tablet
	</>,
	<>Ad-free reading on all your devices</>,
	<>
		Exclusive newsletter for supporters, sent every week from the Guardian
		newsroom
	</>,
	<>Far fewer asks for support</>,
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

const planData: Partial<Record<PaperProductOptions, PlanData>> = {
	EverydayPlus: {
		description: (
			<>
				<strong>Home delivery</strong> of <strong>the Guardian</strong> from
				Monday to Saturday and <strong>the Observer</strong> on Sundays plus
				exclusive <strong>digital rewards</strong>
			</>
		),
		benefits: {
			label: <></>,
			items: [benefitGuardianSixDay, benefitObserverSunday],
		},
		digitalRewards: {
			label: digitalRewardsLabel,
			items: baseDigitalRewards,
		},
	},
	SixdayPlus: {
		description: (
			<>
				<strong>Home delivery</strong> of <strong>the Guardian</strong> plus
				exclusive <strong>digital rewards</strong>
			</>
		),
		benefits: {
			label: <></>,
			items: [benefitGuardianSixDay],
		},
		digitalRewards: {
			label: digitalRewardsLabel,
			items: baseDigitalRewards,
		},
	},
	WeekendPlus: {
		description: (
			<>
				<strong>Home delivery</strong> of the Saturday editions of{' '}
				<strong>the Guardian</strong> and <strong>the Observer</strong> on
				Sundays plus exclusive <strong>digital rewards</strong>
			</>
		),
		benefits: {
			label: <></>,
			items: [benefitGuardianSaturday, benefitObserverSunday],
		},
		digitalRewards: {
			label: digitalRewardsLabel,
			items: baseDigitalRewards,
		},
	},
	SaturdayPlus: {
		description: (
			<>
				<strong>Home delivery</strong> of <strong>the Guardian</strong> on
				Saturdays plus exclusive <strong>digital rewards</strong>
			</>
		),
		benefits: {
			label: <></>,
			items: [benefitGuardianSaturday],
		},
		digitalRewards: {
			label: digitalRewardsLabel,
			items: baseDigitalRewards,
		},
	},
	Sunday: {
		description: (
			<>
				<strong>Home delivery</strong> of <strong>the Observer</strong> on every
				Sunday
			</>
		),
		benefits: {
			label: <></>,
			items: [benefitObserverSunday],
		},
	},
};

export default function getPlanData(
	ratePlanKey: PaperProductOptions,
	fulfillmentOption?: PaperFulfilmentOptions,
): PlanData | undefined {
	const validPaperPlan = planData[ratePlanKey];
	if (!validPaperPlan) {
		return undefined;
	}

	const paperPlan = {
		...validPaperPlan,
		benefits: {
			label: fulfillmentOption ? benefitsLabel[fulfillmentOption] : <></>,
			items: validPaperPlan.benefits.items,
		},
	};
	return paperPlan;
}

export function getPlanBenefitData(
	ratePlanKey: PaperProductOptions,
): BenefitsCheckListData[] | undefined {
	const ratePlanData = getPlanData(ratePlanKey);
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
