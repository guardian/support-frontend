import { css } from '@emotion/react';
import { from, textSans } from '@guardian/source-foundations';
import type { ReactElement } from 'react';
import { offerStraplineBlue } from 'stylesheets/emotion/colours';

// Requirement: strapline acts differently (becomes full-width) at smaller device widths if the copy is longer than 32 chars
const offerStraplineStyles = (isLong: boolean) => css`
	${textSans.medium({
		fontWeight: 'bold',
	})};
	padding: 4px 10px 8px;
	margin-bottom: 0;
	background-color: ${offerStraplineBlue};
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
	copy?: string;
	orderIsAGift?: boolean;
};

function OfferStrapline({ copy, orderIsAGift }: PropTypes): ReactElement {
	// Requirement: last line must include a minimum of 2 words
	const noWidowWord = (c: string) => {
		const trimmedCopy = c.trim();
		const copyLength = trimmedCopy.length;
		const wordArray: string[] = trimmedCopy.split(' ');
		if (wordArray.length > 1) {
			const lastWord: string | undefined = wordArray.pop();
			return (
				<div css={offerStraplineStyles(copyLength > 32)}>
					<span>
						{wordArray.join(' ')}&nbsp;{lastWord}
					</span>
				</div>
			);
		}
		return <div css={offerStraplineStyles(false)}>{c}</div>;
	};

	// Requirement: never show the offer on the Gift page
	if (orderIsAGift) {
		return <></>;
	}

	if (copy) {
		return noWidowWord(copy);
	} else {
		return <></>;
	}
}

export default OfferStrapline;
