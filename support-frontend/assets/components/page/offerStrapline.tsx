import { css } from '@emotion/react';
import {
	from,
	textSansBold17,
	textSansBold20,
	textSansBold24,
} from '@guardian/source/foundations';

const fontSizes = {
	regular: css`
		${textSansBold17};
		${from.tablet} {
			${textSansBold20};
		}
		${from.desktop} {
			${textSansBold24};
		}
	`,

	small: css`
		${textSansBold17};
	`,
};

// Requirement: strapline acts differently (becomes full-width) at smaller device widths if the copy is longer than 32 chars
const offerStraplineStyles = (
	isLong: boolean,
	bgCol: string,
	fgCol: string,
	size: Size,
) => css`
	padding: 4px 10px 8px;
	margin-bottom: 0;
	background-color: ${bgCol};
	color: ${fgCol};
	${isLong
		? 'width: 100%;'
		: `
        width: fit-content;
        max-width: 100%;
    `}

	${from.phablet} {
		padding: 4px 20px 8px;
		${isLong
			? `
            width: fit-content;
            max-width: 100%;
        `
			: ''}
	}
	${from.tablet} {
		padding: 4px 20px 12px;
		max-width: 50%;
	}
	${fontSizes[size]}
`;

type Size = 'small' | 'regular';

type PropTypes = {
	fgCol: string;
	bgCol: string;
	copy: string;
	size?: Size;
};

export default function OfferStrapline({
	fgCol,
	bgCol,
	copy,
	size = 'regular',
}: PropTypes) {
	// Requirement: last line must include a minimum of 2 words
	const noWidowWord = (c: string) => {
		const trimmedCopy = c.trim();
		const copyLength = trimmedCopy.length;
		const wordArray: string[] = trimmedCopy.split(' ');
		if (wordArray.length > 1) {
			const lastWord: string | undefined = wordArray.pop();
			return (
				<div css={offerStraplineStyles(copyLength > 32, bgCol, fgCol, size)}>
					<span>
						{wordArray.join(' ')}&nbsp;{lastWord}
					</span>
				</div>
			);
		}
		return <div css={offerStraplineStyles(false, bgCol, fgCol, size)}>{c}</div>;
	};

	if (copy) {
		return noWidowWord(copy);
	}

	return null;
}
