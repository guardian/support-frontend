import { Container } from '@guardian/source/react-components';
import React from 'react';
import type { GridPictureProp } from 'components/gridPicture/gridPicture';
import GridPicture from 'components/gridPicture/gridPicture';

export default {
	title: 'Grid Images/GridPicture',
	component: GridPicture,
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
				component: `The GridPicture component can show completely different images at
        different breakpoints`,
			},
		},
	},
};

function Template(args: GridPictureProp) {
	return <GridPicture {...args} />;
}
Template.args = {} as GridPictureProp;

export const EditionsPackshotShort = Template.bind({});
EditionsPackshotShort.args = {
	sources: [
		{
			gridId: 'editionsPackshotShort',
			srcSizes: [500, 140],
			imgType: 'png',
			sizes: '(min-width: 740px) 500px, 140vw',
			media: '(max-width: 1139px)',
		},
		{
			gridId: 'editionsPackshotAus',
			srcSizes: [500],
			imgType: 'png',
			sizes: '(min-width: 1140px) 500px',
			media: '(min-width: 1140px)',
		},
	],
	fallback: 'editionsPackshotShort',
	fallbackSize: 500,
	altText: '',
	fallbackImgType: 'png',
};
