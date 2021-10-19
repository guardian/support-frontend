// ----- Imports ----- //
import {
	GRID_DOMAIN,
	gridSrcset,
	gridUrl,
	imageCatalogue,
} from '../images/theGrid';
// ----- Tests ----- //
describe('theGrid', () => {
	it('should construct a grid url', () => {
		const gridId = 'guardianObserverOffice';
		const size = 333;
		const expectedUrl = `${GRID_DOMAIN}/${imageCatalogue[gridId]}/333.jpg`;
		expect(gridUrl(gridId, size)).toEqual(expectedUrl);
	});
	it('should construct a srcset of grid urls', () => {
		const gridId = 'guardianObserverOffice';
		const sizes = [300, 500];
		const urlPath = `${GRID_DOMAIN}/${imageCatalogue[gridId]}`;
		const expectedSrcset = `${urlPath}/300.jpg 300w, ${urlPath}/500.jpg 500w`;
		expect(gridSrcset(gridId, sizes)).toEqual(expectedSrcset);
	});
});
