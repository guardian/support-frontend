import { Container } from '@guardian/source-react-components';
import React from 'react';
import GridImage from 'components/gridImage/gridImage';

export default {
	title: 'Grid Images/Image',
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
				>
					The GridImage component is responsive and will request different sizes
					of the image at the specified breakpoints
				</p>
				<Story />
			</Container>
		),
	],
};

export function Image(): JSX.Element {
	return (
		<GridImage
			gridId="weeklyCampaignHeroImg"
			srcSizes={[1000, 500, 140]}
			sizes="(max-width: 740px) 100%,
  (max-width: 1067px) 150%,
  500px"
			imgType="png"
			altText="A collection of Guardian Weekly magazines"
		/>
	);
}
