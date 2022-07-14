import React from 'react';
import GiftHeadingAnimation from 'components/animations/giftHeadingAnimation';

export default {
	title: 'Animations/Gift Heading Animation',
	component: GiftHeadingAnimation,
	decorators: [
		(Story: React.FC): JSX.Element => (
			<div
				style={{
					backgroundColor: '#00568D',
					color: '#fff',
					padding: '1em',
				}}
			>
				<Story />
			</div>
		),
	],
};

export { default as GiftHeadingAnimation } from 'components/animations/giftHeadingAnimation';
