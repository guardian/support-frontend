import type React from 'preact/compat';
import type { GridPictureProp } from 'components/gridPicture/gridPicture';
import GridPicture from 'components/gridPicture/gridPicture';

export default function PaperPackShots(): React.ReactElement<GridPictureProp> {
	return (
		<GridPicture
			sources={[
				{
					gridId: `newspaperLandingHeroMobile`,
					srcSizes: [1000],
					sizes: '331px',
					imgType: 'png',
					media: '(max-width: 739px)',
				},
				{
					gridId: `newspaperLandingHeroTablet`,
					srcSizes: [1000],
					sizes: '340px',
					imgType: 'png',
					media: '(max-width: 979px)',
				},
				{
					gridId: `newspaperLandingHeroDesktop`,
					srcSizes: [1000],
					sizes: '435px',
					imgType: 'png',
					media: '(min-width: 980px)',
				},
			]}
			fallback={`newspaperLandingHeroDesktop`}
			fallbackSize={1000}
			altText="Guardian Newspaper Contents"
		/>
	);
}
