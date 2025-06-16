import type { PaperProductOptions } from 'helpers/productPrice/productOptions';

export type PlanData = {
	description: JSX.Element;
	benefits: {
		label: JSX.Element;
		items: string[];
	};
	digitalRewards?: {
		label: JSX.Element;
		items: string[];
	};
};

const benefitsLabel = (
	<>
		Enjoy <strong>home delivery</strong> of your newspaper
	</>
);

const digitalRewardsLabel = (
	<>
		Unlock exclusive <strong>digital rewards</strong>
	</>
);

const baseDigitalRewards = [
	'Unlimited access to the refreshed Guardian app',
	'Ad-free reading on all your devices',
	'Exclusive newsletter for supporters, sent every week from the Guardian newsroom',
	'Far fewer asks for support',
];

const planData: Record<PaperProductOptions, PlanData> = {
	Everyday: {
		description: (
			<>
				<strong>Home delivery</strong> of <strong>the Guardian</strong> from
				Monday to Saturday and <strong>the Observer</strong> on Sundays plus
				exclusive <strong>digital rewards</strong>
			</>
		),
		benefits: {
			label: benefitsLabel,
			items: [
				'The Guardian and all its supplements Monday to Saturday',
				'The Observer and all its supplements, delivered on Sundays',
			],
		},
		digitalRewards: {
			label: digitalRewardsLabel,
			items: baseDigitalRewards,
		},
	},
	Sixday: {
		description: (
			<>
				<strong>Home delivery</strong> of <strong>the Guardian</strong> plus
				exclusive <strong>digital rewards</strong>
			</>
		),
		benefits: {
			label: benefitsLabel,
			items: ['The Guardian and all its supplements Monday to Saturday'],
		},
		digitalRewards: {
			label: digitalRewardsLabel,
			items: baseDigitalRewards,
		},
	},
	Weekend: {
		description: (
			<>
				<strong>Home delivery</strong> of the Saturday editions of{' '}
				<strong>the Guardian</strong> and <strong>the Observer</strong> on
				Sundays plus exclusive <strong>digital rewards</strong>
			</>
		),
		benefits: {
			label: benefitsLabel,
			items: [
				'Saturday edition of The Guardian and all its Saturday supplements',
				'The Observer and all its supplements, delivered on Sundays',
			],
		},
		digitalRewards: {
			label: digitalRewardsLabel,
			items: baseDigitalRewards,
		},
	},
	Saturday: {
		description: (
			<>
				<strong>Home delivery</strong> of <strong>the Guardian</strong> on
				Saturdays plus exclusive <strong>digital rewards</strong>
			</>
		),
		benefits: {
			label: benefitsLabel,
			items: [
				'Saturday edition of The Guardian and all its Saturday supplements',
			],
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
			label: (
				<>
					<strong>home delivery</strong>
				</>
			),
			items: ['The Observer and all its supplements, delivered on Sundays  '],
		},
	},
	SaturdayPlus: {
		description: <></>,
		benefits: {
			label: <></>,
			items: [],
		},
		digitalRewards: {
			label: <></>,
			items: [],
		},
	},
	SundayPlus: {
		description: <></>,
		benefits: {
			label: <></>,
			items: [],
		},
		digitalRewards: {
			label: <></>,
			items: [],
		},
	},
	WeekendPlus: {
		description: <></>,
		benefits: {
			label: <></>,
			items: [],
		},
		digitalRewards: {
			label: <></>,
			items: [],
		},
	},
	SixdayPlus: {
		description: <></>,
		benefits: {
			label: <></>,
			items: [],
		},
		digitalRewards: {
			label: <></>,
			items: [],
		},
	},
	EverydayPlus: {
		description: <></>,
		benefits: {
			label: <></>,
			items: [],
		},
		digitalRewards: {
			label: <></>,
			items: [],
		},
	},
};

export default function getPlanData(ratePlanKey: PaperProductOptions) {
	return planData[ratePlanKey];
}
