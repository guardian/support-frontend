// @flow

// ----- Imports ----- //

import { gridUrl, gridSrcset, GRID_DOMAIN } from '../theGrid';


// ----- Tests ----- //

describe('theGrid', () => {

  it('should construct a grid url', () => {

    const gridId = 'not_a_real_id';
    const size = 333;
    const expectedUrl = `${GRID_DOMAIN}/${gridId}/333.jpg`;

    expect(gridUrl(gridId, size)).toEqual(expectedUrl);

  });

  it('should construct a srcset of grid urls', () => {

    const gridId = 'not_a_real_id';
    const sizes = [300, 500];
    const urlPath = `${GRID_DOMAIN}/${gridId}`;

    const expectedSrcset = `${urlPath}/300.jpg 300w, ${urlPath}/500.jpg 500w`;

    expect(gridSrcset(gridId, sizes)).toEqual(expectedSrcset);

  });

});
