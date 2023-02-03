import { Container } from '@guardian/source-react-components';
import React from 'react';
import type { GridImg } from 'components/gridImage/gridImage';
import GridImage from 'components/gridImage/gridImage';

export default {
	title: 'Grid Images/GridImage',
	component: GridImage,
	decorators: [
		(Story: React.FC): JSX.Element => (
			<Container>
				<p
					style={{
						padding: '12px',
						textAlign: 'center',
						maxWidth: '50%',
					}}
				/>
				<Story />
			</Container>
		),
	],
	parameters: {
		docs: {
			description: {
				component: `The GridImage component is responsive and will request different sizes
        of the image at the specified breakpoints`,
			},
		},
	},
};

function Template(args: GridImg) {
	return <GridImage {...args} />;
}
Template.args = {} as GridImg;

export const WeeklyCampaignHero = Template.bind({});
WeeklyCampaignHero.args = {
	gridId: 'weeklyCampaignHeroImg',
	srcSizes: [1000, 500, 140],
	sizes: '(max-width: 740px) 140px,(max-width: 1067px) 500px,1000px',
	altText: 'A collection of Guardian Weekly magazines',
	imgType: 'png',
};
