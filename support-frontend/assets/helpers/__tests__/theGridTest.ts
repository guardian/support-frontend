// ----- Imports ----- //
import { GRID_DOMAIN, gridSrcset, gridUrl } from '../images/theGrid';
// ----- Tests ----- //
describe('theGrid', () => {
	it('should construct a grid url', () => {
		const gridId = 'weeklyLandingHero';
		const size = 333;
		const expectedUrl = `${GRID_DOMAIN}/img/media/0e5187e523a6445003fae7b1bb4124a8a4a814c8/0_655_6362_2706/master/333.jpg?dpr=1&s=none&width=333`;
		expect(gridUrl(gridId, size)).toEqual(expectedUrl);
	});
	it('should construct a srcset of grid urls', () => {
		const gridId = 'weeklyLandingHero';
		const sizes = [300, 500];
		const urlPath = `${GRID_DOMAIN}/img/media/0e5187e523a6445003fae7b1bb4124a8a4a814c8/0_655_6362_2706/master`;
		const expectedSrcset = `${urlPath}/300.jpg?dpr=1&s=none&width=300 300w, ${urlPath}/500.jpg?dpr=1&s=none&width=500 500w`;
		expect(gridSrcset(gridId, sizes)).toEqual(expectedSrcset);
	});
});
