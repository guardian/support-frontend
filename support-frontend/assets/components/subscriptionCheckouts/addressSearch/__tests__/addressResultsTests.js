// @flow

// ----- Imports ----- //

import {
  parseHighlights, parseNormal, parseTextRegions,
} from 'components/subscriptionCheckouts/addressSearch/addressResultsHelpers';

// ----- Tests ----- //

describe('address description highlighting', () => {
  it('can parse a highlights string', () => {
    const highlights = parseHighlights('0-3, 5-7');
    expect(highlights.length).toBe(2);
    expect(highlights[0]).toEqual([0, 3]);
    expect(highlights[1]).toEqual([5, 7]);

    const noHighlights = parseHighlights('');
    expect(noHighlights.length).toEqual(0);
  });

  it('can work out normal regions', () => {
    const result1 = parseNormal('the quick brown fox', '0-2, 6-8');
    expect(result1.length).toBe(2);
    expect(result1[0]).toEqual([3, 5]);
    expect(result1[1]).toEqual([9, 18]);

    const result2 = parseNormal('the quick', '2-3, 5-6');
    expect(result2.length).toBe(3);
    expect(result2[0]).toEqual([0, 1]);
    expect(result2[1]).toEqual([4, 4]);
    expect(result2[2]).toEqual([7, 8]);

    const result3 = parseNormal('the quick', '5-8');
    expect(result3.length).toBe(1);
    expect(result3[0]).toEqual([0, 4]);

    const result4 = parseNormal('the quick', '0-3');
    expect(result4.length).toBe(1);
    expect(result4[0]).toEqual([4, 8]);

    const result5 = parseNormal('the quick', '0-8');
    expect(result5.length).toBe(0);

    const result6 = parseNormal('the quick', '');
    expect(result6.length).toBe(1);
    expect(result6[0]).toEqual([0, 8]);

  });

  it('can return a correctly sorted TextRegion array', () => {
    const result = parseTextRegions('the quick brown fox', '0-2, 6-8');
    expect(result.length).toBe(4);
    expect(result[0].start).toBe(0);
    expect(result[3].end).toBe(18);

    const result2 = parseTextRegions('London, N10 1ST', '8-10');
    expect(result2.length).toBe(3);
    expect(result2[1].length).toBe(2);
  });
});
