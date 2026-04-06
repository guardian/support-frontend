import { css } from '@emotion/react';
import GridPicture from 'components/gridPicture/gridPicture';
import type { Source } from 'components/gridPicture/gridPicture';

type HeroPictureDevices = 'mobile' | 'tablet' | 'desktop';

export type HeroPictureProps = {
	altText: string;
} & Record<HeroPictureDevices, Pick<Source, 'gridId' | 'sizes' | 'imgType'>>;

const cssOverrides = css`
	img {
		width: 100%;
	}
`;

function HeroPicture(props: HeroPictureProps) {
	return (
		<GridPicture
			sources={[
				{
					gridId: props.mobile.gridId,
					srcSizes: [1000],
					sizes: props.mobile.sizes,
					imgType: props.mobile.imgType,
					media: '(max-width: 739px)',
				},
				{
					gridId: props.tablet.gridId,
					srcSizes: [2000],
					sizes: props.tablet.sizes,
					imgType: props.tablet.imgType,
					media: '(max-width: 979px)',
				},
				{
					gridId: props.desktop.gridId,
					srcSizes: [2000],
					sizes: props.desktop.sizes,
					imgType: props.desktop.imgType,
					media: '(min-width: 980px)',
				},
			]}
			fallback={props.desktop.gridId}
			fallbackSize={2000}
			altText={props.altText}
			cssOverrides={cssOverrides}
		/>
	);
}

export default HeroPicture;
