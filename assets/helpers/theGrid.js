// @flow

// ----- Constants ----- //

export const GRID_DOMAIN = 'https://media.guim.co.uk';


// ----- Functions ----- //

// Builds a grid url from and id and an image size.
// Example: https://media.guim.co.uk/g65756g5/300.jpg
export function gridUrl(gridId: string, size: number): string {

  const path = `${gridId}/${size}.jpg`;
  const url = new URL(path, GRID_DOMAIN);

  return url.toString();

}

// Returns a series of grid urls and their corresponding sizes.
// Example:
//   "https://media.guim.co.uk/g65756g5/300.jpg 300w,
//    https://media.guim.co.uk/g65756g5/500.jpg 500w,
//    https://media.guim.co.uk/g65756g5/700.jpg 700w"
export function gridSrcset(gridId: string, sizes: number[]): string {

  const sources = sizes.map(size => `${gridUrl(gridId, size)} ${size}w`);
  return sources.join(', ');

}
