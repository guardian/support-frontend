type RegionType = 'highlight' | 'normal';
type TextRegion = {
	start: number;
	end: number;
	type: RegionType;
};

const parseHighlights = (highlightString: string): number[][] =>
	highlightString === ''
		? []
		: highlightString
				.split(',')
				.map((occurrence) =>
					occurrence.split('-').map((num) => parseInt(num, 10)),
				) // Somewhat confusingly Loqate's highlight notation is exclusive of the end character
				// so 0-3 actually means chars 0, 1 & 2
				.map((highlight) => [highlight[0], highlight[1] - 1]);

const lastItem = (arr: number[][]) => arr[arr.length - 1];

const parseNormal = (text: string, highlightString: string): number[][] => {
	const lastChar = text.length - 1;
	const highlights = parseHighlights(highlightString);

	if (highlights.length === 0) {
		return [[0, lastChar]];
	}

	const normal = highlights
		.map((highlight, index) => {
			if (index < highlights.length - 1) {
				return [highlight[1] + 1, highlights[index + 1][0] - 1];
			}

			return [-1, -1];
		})
		.filter((item) => item[0] !== -1);

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

const parseTextRegions = (
	text: string,
	highlightString: string,
): TextRegion[] => {
	const highlights: TextRegion[] = parseHighlights(highlightString).map(
		(arr) => ({
			start: arr[0],
			end: arr[1],
			type: 'highlight',
		}),
	);
	const normal = parseNormal(text, highlightString).map((arr) => ({
		start: arr[0],
		end: arr[1],
		type: 'normal',
	}));
	const all = highlights.concat(normal);
	all.sort((a, b) => a.start - b.start);
	return all;
};

export { parseHighlights, parseNormal, parseTextRegions };
