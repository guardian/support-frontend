import catalogue from './imageCatalogue.json';
// ----- Types ----- //
export type ImageType = 'jpg' | 'png';
// ----- Setup ----- //
export const GRID_DOMAIN = 'https://i.guim.co.uk';
const imageCatalogue: Record<string, string> = catalogue;
// Utility type: https://flow.org/en/docs/types/utilities/#toc-keys
export type ImageId = keyof typeof imageCatalogue;
// ----- Functions ----- //
/**
 * Builds a fastly-image-service url from and id and an image size.
 * The source image used is of the original Grid image, and uses the Fastly service for any optimisations.
 * see: https://github.com/guardian/fastly-image-service
 * Example: https://i.guim.co.uk/img/media/017a2f5c27394635b53c414962bbb775ce9b131d/5_39_1572_861/1572.jpg?dpr=1&s=none&width=500`
 */
export function gridUrl(
	gridId: ImageId,
	size: number,
	imgType: ImageType = 'jpg',
): string {
	const gridReference = imageCatalogue[gridId];

	if (!gridReference) {
		return '';
	}

	const originalWidth = gridReference.split('_')[2];
	const path = `/img/media/${imageCatalogue[gridId]}/master/${originalWidth}.${imgType}?dpr=1&s=none&width=${size}`;
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
