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
		heroDirection: {
			control: 'radio',
			options: ['default', 'reverse'],
			description: 'Reverse the hero direction (image on the left)',
		},
		imagePosition: {
			control: 'radio',
			options: ['float', 'bottom'],
			description: 'Position of the image slot',
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
		heroDirection: 'default',
		imagePosition: 'float',
		backgroundColor: '#052962',
		color: '#fff',
	},
};

export function Hero({
	heroDirection,
	imagePosition,
	backgroundColor,
	color,
}: {
	heroDirection: 'default' | 'reverse';
	imagePosition: 'float' | 'bottom';
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
					<h1>some title</h1>
					<p>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque id
						justo at est elementum egestas rhoncus eu nulla. Proin pellentesque
						massa at metus condimentum, a aliquam erat condimentum. Vivamus quis
						rutrum nulla. Curabitur ut ullamcorper magna, eu ornare nunc. Lorem
						ipsum dolor sit amet, consectetur adipiscing elit. Quisque id justo
						at est elementum egestas rhoncus eu nulla. Proin pellentesque massa
						at metus condimentum, a aliquam erat condimentum. Vivamus quis
						rutrum nulla. Curabitur ut ullamcorper magna, eu ornare nunc.
					</p>
				</section>
			}
			heroDirection={heroDirection}
			imagePosition={imagePosition}
			cssOverrides={css`
				background-color: ${backgroundColor};
				color: ${color};
			`}
		/>
	);
}
