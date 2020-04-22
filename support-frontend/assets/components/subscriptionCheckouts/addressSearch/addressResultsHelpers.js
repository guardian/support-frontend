// @flow

type RegionType = 'highlight' | 'normal';

type TextRegion = {
  start: number,
  end: number,
  length: number,
  type: RegionType,
}

const parseHighlights = (highlightString: string): [number[]] => (highlightString === '' ? [] :
  highlightString
    .split(',')
    .map(occurrence => occurrence.split('-').map(num => parseInt(num, 10))));

const lastItem = (arr: T[]) => arr[arr.length - 1];

const parseNormal = (text: string, highlightString: string): [number[]] => {
  const lastChar = text.length - 1;
  const highlights = parseHighlights(highlightString);
  if (highlights.length === 0) {
    return [[0, lastChar]];
  }

  const normal = highlights.map((highlight, index) => {
    if (index < highlights.length - 1) {
      return [highlight[1] + 1, highlights[index + 1][0] - 1];
    }
    return null;
  }).filter(item => item !== null);
  // if the highlighting doesn't start at zero
  if (highlights[0][0] !== 0) {
    normal.unshift([0, highlights[0][0] - 1]);
  }
  // add the text after the end of the last highlight if needed
  if (lastItem(highlights)[1] < lastChar) {
    normal.push([lastItem(highlights)[1] + 1, lastChar]);
  }
  return normal;
};

const parseTextRegions = (text: string, highlightString: string): TextRegion[] => {
  const highlights: TextRegion[] = parseHighlights(highlightString).map(arr =>
    ({
      start: arr[0],
      end: arr[1],
      length: arr[1] - arr[0],
      type: 'highlight',
    }));
  const normal = parseNormal(text, highlightString).map(arr =>
    ({
      start: arr[0],
      end: arr[1],
      length: arr[1] - arr[0],
      type: 'normal',
    }));
  const all = highlights.concat(normal);
  all.sort((a, b) => a.start - b.start);
  return all;
};


export { parseHighlights, parseNormal, parseTextRegions };
