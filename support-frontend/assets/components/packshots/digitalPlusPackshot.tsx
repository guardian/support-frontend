import GridPicture from 'components/gridPicture/gridPicture';

function DigitalPlusPackshot(): JSX.Element {
	return (
		<GridPicture
			sources={[
				{
					gridId: 'digitalPlusMobileTablet',
					srcSizes: [432],
					imgType: 'png',
					sizes: '400px',
					media: '(max-width: 980px)',
				},
				{
					gridId: 'digitalPlusDesktop',
					srcSizes: [364],
					imgType: 'png',
					sizes: '364px',
					media: '(max-width: 1139px)',
				},
				{
					gridId: 'digitalPlusLeftColWide',
					srcSizes: [580],
					imgType: 'png',
					sizes: '580px',
					media: '(min-width: 1140px)',
				},
			]}
			fallback="digitalPlusLeftColWide"
			fallbackSize={580}
			altText=""
			fallbackImgType="jpg"
		/>
	);
}

export default DigitalPlusPackshot;
