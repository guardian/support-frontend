import { css } from '@emotion/react';
import { from, textSans } from '@guardian/source-foundations';
import type { ReactElement } from 'react';

// Requirement: strapline acts differently (becomes full-width) at smaller device widths if the copy is longer than 32 chars
const offerStraplineStyles = (
	isLong: boolean,
	bgCol: string,
	fgCol: string,
) => css`
	${textSans.medium({
		fontWeight: 'bold',
	})};
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
		${textSans.large({
			fontWeight: 'bold',
		})};
		padding: 4px 20px 12px;
		max-width: 50%;
	}
	${from.desktop} {
		${textSans.xlarge({
			fontWeight: 'bold',
		})};
	}
`;

type PropTypes = {
	fgCol: string;
	bgCol: string;
	copy?: string;
	orderIsAGift?: boolean;
};

function OfferStrapline({ fgCol, bgCol, copy }: PropTypes): ReactElement {
	// Requirement: last line must include a minimum of 2 words
	const noWidowWord = (c: string) => {
		const trimmedCopy = c.trim();
		const copyLength = trimmedCopy.length;
		const wordArray: string[] = trimmedCopy.split(' ');
		if (wordArray.length > 1) {
			const lastWord: string | undefined = wordArray.pop();
			return (
				<div css={offerStraplineStyles(copyLength > 32, bgCol, fgCol)}>
					<span>
						{wordArray.join(' ')}&nbsp;{lastWord}
					</span>
				</div>
			);
		}
		return <div css={offerStraplineStyles(false, bgCol, fgCol)}>{c}</div>;
	};

	if (copy) {
		return noWidowWord(copy);
	} else {
		return <></>;
	}
}

export default OfferStrapline;
