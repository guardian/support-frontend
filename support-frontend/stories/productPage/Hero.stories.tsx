import { css } from '@emotion/react';
import CentredContainer from 'components/containers/centredContainer';
import HeroSkeleton from 'components/page/hero';
import HeroPicture from 'components/page/heroPicture';
import { HeroPictureData } from '../images/HeroPicture.stories';

export default {
	title: 'Hero Skeleton',
	component: HeroSkeleton,
	decorators: [
		(Story: React.FC): JSX.Element => (
			<div
				style={{
					marginTop: '100px',
					padding: '50px 0',
					backgroundColor: '#EDEDED',
				}}
			>
				<CentredContainer>
					<Story />
				</CentredContainer>
			</div>
		),
	],
	argTypes: {
		reverseHero: {
			control: 'boolean',
			description: 'Reverse the hero direction (image on the left)',
		},
		backgroundColor: {
			control: 'color',
			description: 'Hero background colour',
		},
		color: {
			control: 'color',
			description: 'Hero text colour',
		},
	},
	args: {
		reverseHero: false,
		backgroundColor: '#052962',
		color: '#fff',
	},
};

export function Hero({
	reverseHero,
	backgroundColor,
	color,
}: {
	reverseHero: boolean;
	backgroundColor: string;
	color: string;
}): JSX.Element {
	return (
		<HeroSkeleton
			imageSlot={<HeroPicture {...HeroPictureData} />}
			contentSlot={
				<section>
					<p>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque id
						justo at est elementum egestas rhoncus eu nulla. Proin pellentesque
						massa at metus condimentum, a aliquam erat condimentum. Vivamus quis
						rutrum nulla. Curabitur ut ullamcorper magna, eu ornare nunc.
					</p>
				</section>
			}
			heroDirection={reverseHero ? 'row-reverse' : undefined}
			cssOverrides={css`
				background-color: ${backgroundColor};
				color: ${color};
			`}
		/>
	);
}
