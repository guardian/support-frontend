import { $Keys } from 'utility-types';
import catalogue from './imageCatalogue.json';
// ----- Types ----- //
export type ImageType = 'jpg' | 'png';
// ----- Setup ----- //
export const GRID_DOMAIN = 'https://media.guim.co.uk';
export const imageCatalogue: Record<string, string> = catalogue;
// Utility type: https://flow.org/en/docs/types/utilities/#toc-keys
export type ImageId = $Keys<typeof imageCatalogue>;
// ----- Functions ----- //
// Builds a grid url from and id and an image size.
// Example: https://media.guim.co.uk/g65756g5/300.jpg
export function gridUrl(
	gridId: ImageId,
	size: number,
	imgType: ImageType = 'jpg',
): string {
	const path = `${imageCatalogue[gridId]}/${size}.${imgType}`;
	const url = new URL(path, GRID_DOMAIN);
	return url.toString();
}
// Returns a series of grid urls and their corresponding sizes.
// Example:
//   "https://media.guim.co.uk/g65756g5/300.jpg 300w,
//    https://media.guim.co.uk/g65756g5/500.jpg 500w,
//    https://media.guim.co.uk/g65756g5/700.jpg 700w"
export function gridSrcset(
	gridId: ImageId,
	sizes: number[],
	imgType?: ImageType,
): string {
	const sources = sizes.map(
		(size) => `${gridUrl(gridId, size, imgType)} ${size}w`,
	);
	return sources.join(', ');
}
