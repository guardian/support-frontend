import React from 'react';
import AnimatedDots from 'components/spinners/animatedDots';

export default {
	title: 'Animations/Loading Dots',
	component: AnimatedDots,
	argTypes: {
		appearance: {
			control: {
				type: 'radio',
				options: ['light', 'dark'],
			},
		},
	},
	decorators: [
		(Story: React.FC): JSX.Element => (
			<div
				style={{
					background: 'lightgray',
					display: 'flex',
					padding: '3em',
					width: '100%',
					boxSizing: 'border-box',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<Story />
			</div>
		),
	],
};

export function LoadingDots(args: {
	appearance: 'light' | 'dark';
}): JSX.Element {
	return <AnimatedDots appearance={args.appearance} />;
}

LoadingDots.args = {
	appearance: 'light',
};
