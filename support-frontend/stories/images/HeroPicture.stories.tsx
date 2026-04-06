import type { Meta, StoryObj } from '@storybook/preact-vite';
import type { HeroPictureProps } from 'components/page/heroPicture';
import HeroPicture from 'components/page/heroPicture';

const meta: Meta<typeof HeroPicture> = {
	title: 'Grid Images/HeroPicture',
	component: HeroPicture,
	parameters: {
		docs: {
			description: {
				component:
					'Hero picture for the Weekly Digital landing page, showing different crops at different breakpoints.',
			},
		},
		chromatic: {
			modes: {
				mobile: { viewport: 'mobile' },
				tablet: { viewport: 'tablet' },
				desktop: { viewport: 'desktop' },
			},
		},
	},
};

export default meta;

type Story = StoryObj<typeof HeroPicture>;

export const HeroPictureData: HeroPictureProps = {
	altText: 'images for Hero Picture viewport testing',
	mobile: {
		gridId: 'placeholder_16x9',
		sizes: '240px',
		imgType: 'jpg',
	},
	tablet: {
		gridId: 'placeholder_1x1',
		sizes: '200px',
		imgType: 'jpg',
	},
	desktop: {
		gridId: 'placeholder_4x3',
		sizes: '180px',
		imgType: 'jpg',
	},
};

export const HeroPictureStory: Story = {
	args: HeroPictureData,
};
