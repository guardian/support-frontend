import { css } from '@emotion/react';
import CentredContainer from 'components/containers/centredContainer';
import GridPicture from 'components/gridPicture/gridPicture';
import HeroContainer from 'components/page/hero';

export default {
	title: 'Hero Container',
	component: HeroContainer,
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
		<HeroContainer
			imageSlot={
				<GridPicture
					sources={[
						{
							gridId: 'placeholder_16x9',
							srcSizes: [962, 500],
							sizes: '240px',
							imgType: 'jpg',
							media: '(max-width: 739px)',
						},
						{
							gridId: 'placeholder_1x1',
							srcSizes: [802, 500],
							sizes: '200px',
							imgType: 'jpg',
							media: '(max-width: 979px)',
						},
						{
							gridId: 'placeholder_4x3',
							srcSizes: [962, 500],
							sizes: '240px',
							imgType: 'jpg',
							media: '(min-width: 980px)',
						},
					]}
					fallback="placeholder_4x3"
					fallbackSize={240}
					altText=""
				/>
			}
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
			heroDirection={reverseHero ? 'reverse' : 'default'}
			cssOverrides={css`
				background-color: ${backgroundColor};
				color: ${color};
			`}
		/>
	);
}
