import React from 'react';
import GridPicture from 'components/gridPicture/gridPicture';

const HeroPicture = () => (
	<GridPicture
		sources={[
			{
				gridId: 'paperLandingHero',
				srcSizes: [500, 1000, 2000],
				imgType: 'png',
				sizes: '100vw',
				media:
					'(max-width: 739px) 500px, (min-width: 740px) 1000px, (min-width: 1000px) 2000px',
			},
		]}
		fallback="paperLandingHero"
		fallbackSize={1000}
		altText=""
		fallbackImgType="png"
	/>
);

export { HeroPicture };
