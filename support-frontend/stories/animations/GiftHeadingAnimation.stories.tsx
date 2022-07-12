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

// Dots.args = {
// 	appearance: 'light',
// };

// // stories.add('Animated dots', () => (
// // 	<div
// // 		style={{
// // 			background: '#121212',
// // 			display: 'flex',
// // 			padding: '10vh 10vh',
// // 			minHeight: '100vh',
// // 			width: '100vw',
// // 			boxSizing: 'border-box',
// // 			alignItems: 'center',
// // 			justifyContent: 'center',
// // 		}}
// // 	>
// // 		<AnimatedDots appearance={'light'} />
// // 	</div>
// // ));

// // stories.add('Gifting animation', () => (
// // 	<div
// // 		style={{

// // 		}}
// // 	>
// // 		<GiftHeadingAnimation />
// // 	</div>
// // ));
