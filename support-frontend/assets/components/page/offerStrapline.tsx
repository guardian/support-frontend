import { css, type SerializedStyles } from '@emotion/react';
import {
	from,
	palette,
	space,
	textSansBold17,
	textSansBold20,
	textSansBold24,
} from '@guardian/source/foundations';

const fontSizes = {
	medium: css`
		${textSansBold17};
		padding: ${space[1]}px ${space[3]}px;
		${from.tablet} {
			padding: ${space[2]}px ${space[5]}px;
			${textSansBold20};
		}
		${from.desktop} {
			${textSansBold24};
		}
	`,

	small: css`
		padding: ${space[1]}px ${space[5]}px;
		${textSansBold17};
	`,
};

// Requirement: strapline acts differently (becomes full-width) at smaller device widths if the copy is longer than 32 chars
const offerStraplineStyles = (isLong: boolean, size: Size) => css`
	margin-bottom: 0;
	background-color: ${palette.brand[800]};
	color: ${palette.neutral[7]};
	${isLong
		? 'width: 100%;'
		: `
        width: fit-content;
        max-width: 100%;
    `}

	${from.phablet} {
		${isLong
			? `
            width: fit-content;
            max-width: 100%;
        `
			: ''}
	}
	${from.tablet} {
		max-width: 50%;
	}
	${fontSizes[size]}
`;

type Size = 'small' | 'medium';

type PropTypes = {
	copy: string;
	size?: Size;
	cssOverrides?: SerializedStyles;
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
	copy,
	size = 'medium',
	cssOverrides,
}: PropTypes) {
	const text = preventWidow(copy);
	const isLong = text.length > 32;

	return (
		<div css={[offerStraplineStyles(isLong, size), cssOverrides]}>
			<span>{text}</span>
		</div>
	);
}
