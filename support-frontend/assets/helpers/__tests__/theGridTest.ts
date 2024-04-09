// ----- Imports ----- //
import { GRID_DOMAIN, gridSrcset, gridUrl } from '../images/theGrid';
// ----- Tests ----- //
describe('theGrid', () => {
	it('should construct a grid url from original grid image', () => {
		const gridId = 'weeklyLandingHero';
		const size = 333;
		const expectedUrl = `${GRID_DOMAIN}/img/media/e4ce5980efc3d43b00c2cbb6f193d4070d12a543/0_0_900_600/master/900.jpg?dpr=1&s=none&width=333`;
		expect(gridUrl(gridId, size)).toEqual(expectedUrl);
	});
	it('should construct a srcset of grid urls', () => {
		const gridId = 'weeklyLandingHero';
		const sizes = [300, 500];
		const urlPath = `${GRID_DOMAIN}/img/media/e4ce5980efc3d43b00c2cbb6f193d4070d12a543/0_0_900_600/master`;
		const expectedSrcset = `${urlPath}/900.jpg?dpr=1&s=none&width=300 300w, ${urlPath}/900.jpg?dpr=1&s=none&width=500 500w`;
		expect(gridSrcset(gridId, sizes)).toEqual(expectedSrcset);
	});
});
