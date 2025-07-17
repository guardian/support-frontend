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

export const preventWidow = (text: string): string => {
	const trimmed = text.trim();
	const words = trimmed.split(' ');

	if (words.length <= 1) {
		return text;
	}

	const lastWord = words.pop();
	return `${words.join(' ')}\u00A0${lastWord}`; // \u00A0 is non-breaking space
};

export default function OfferStrapline({
	fgCol,
	bgCol,
	copy,
	size = 'regular',
}: PropTypes) {
	const text = preventWidow(copy);
	const isLong = text.length > 32;

	return (
		<div css={offerStraplineStyles(isLong, bgCol, fgCol, size)}>
			<span>{text}</span>
		</div>
	);
}
