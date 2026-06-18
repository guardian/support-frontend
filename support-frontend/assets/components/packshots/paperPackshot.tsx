import GridPicture from 'components/gridPicture/gridPicture';

function PaperPackShot() {
	return (
		<GridPicture
			sources={[
				{
					gridId: 'newspaperLandingHeroMobile',
					srcSizes: [2000, 1000, 500],
					sizes: '414px',
					imgType: 'png',
					media: '(max-width: 739px)',
				},
				{
					gridId: 'newspaperLandingHeroTablet',
					srcSizes: [1000, 500],
					sizes: '320px',
					imgType: 'png',
					media: '(max-width: 979px)',
				},
				{
					gridId: 'newspaperLandingHeroDesktop',
					srcSizes: [2000, 1000, 500],
					sizes: '422px',
					imgType: 'png',
					media: '(min-width: 980px)',
				},
			]}
			fallback="newspaperLandingHeroDesktop"
			fallbackSize={422}
			altText=""
		/>
	);
}

export default PaperPackShot;
