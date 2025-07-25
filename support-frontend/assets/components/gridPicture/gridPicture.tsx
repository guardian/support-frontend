// ----- NOTE ----- //
// This code is designed to work with multiple image sources and crops (different pictures)
// If you want to work with a single image at different crops, maybe consider gridImage instead
// ----- Imports ----- //
import { gridSrcset, gridUrl } from 'helpers/images/theGrid';
import type { ImageId, ImageType } from 'helpers/images/theGrid';
// ----- Types ----- //
type GridImage = {
	gridId: ImageId;
	srcSizes: number[];
	imgType: ImageType;
};
type GridSlot = {
	sizes: string;
	media: string;
};
type Source = GridImage & GridSlot;
export type GridPictureProp = {
	sources: Source[];
	fallback: string;
	fallbackSize: number;
	altText: string;
	fallbackImgType: ImageType;
}; // ----- Component ----- //

export default function GridPicture(props: GridPictureProp) {
	const sources = props.sources.map((source) => {
		const srcSet = gridSrcset(source.gridId, source.srcSizes, source.imgType);
		return <source sizes={source.sizes} media={source.media} srcSet={srcSet} />;
	});
	return (
		<picture className="component-grid-picture">
			{sources}
			<img
				className="component-grid-picture__image"
				src={gridUrl(props.fallback, props.fallbackSize, props.fallbackImgType)}
				alt={props.altText}
			/>
		</picture>
	);
} // ----- Default Props ----- //

GridPicture.defaultProps = {
	altText: '',
	fallbackImgType: 'jpg',
};
