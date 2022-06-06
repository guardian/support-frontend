import { css } from '@emotion/react';
import { from } from '@guardian/source-foundations';
import type { ReactElement, ReactNode } from 'react';
import { offerStraplineBlue } from 'stylesheets/emotion/colours';

const offerStraplineStyles = css`
	font-family: GuardianTextSans, 'Helvetica Neue', Helvetica, Arial,
		'Lucida Grande', sans-serif;
	font-size: 17px;
	font-weight: bold;
	padding: 4px 10px 8px;
	max-width: 100%;
	width: fit-content;
	margin-bottom: 0;
	background-color: ${offerStraplineBlue};

	${from.phablet} {
		padding: 4px 20px 8px;
	}
	${from.tablet} {
		font-size: 20px;
		padding: 4px 20px 12px;
		max-width: 50%;
	}
	${from.desktop} {
		font-size: 24px;
		max-width: 50%;
	}
`;

// Requirement: strapline acts differently (becomes full-width) at smaller device widths if the copy is longer than 32 chars
const offerStraplineLongCopyStyles = css`
	font-family: GuardianTextSans, 'Helvetica Neue', Helvetica, Arial,
		'Lucida Grande', sans-serif;
	font-size: 17px;
	font-weight: bold;
	padding: 4px 10px 8px;
	width: 100%;
	margin-bottom: 0;
	background-color: ${offerStraplineBlue};

	${from.phablet} {
		max-width: 100%;
		width: fit-content;
		padding: 4px 20px 8px;
	}
	${from.tablet} {
		font-size: 20px;
		padding: 4px 20px 12px;
		max-width: 50%;
	}
	${from.desktop} {
		font-size: 24px;
		max-width: 50%;
	}
`;

type PropTypes = {
	copy?: ReactNode;
};

function OfferStrapline({ copy }: PropTypes): ReactElement {
	// Requirement: last line must include a minimum of 2 words
	const noWidowWord = (c: ReactNode) => {
		if (typeof c === 'string') {
			const trimmedCopy = c.trim();
			const copyLength = trimmedCopy.length;
			const wordArray: string[] = trimmedCopy.split(' ');
			if (wordArray.length > 1) {
				const lastWord: string | undefined = wordArray.pop();

				if (lastWord) {
					const processedWords = `${wordArray.join(' ')}&nbsp;${lastWord}`;
					const getResult = () => {
						return { __html: processedWords };
					};
					return (
						<div
							css={
								copyLength > 32
									? offerStraplineLongCopyStyles
									: offerStraplineStyles
							}
							dangerouslySetInnerHTML={getResult()}
						/>
					);
				}
			}
		}
		return <div css={offerStraplineStyles}>{c}</div>;
	};

	if (copy) {
		return noWidowWord(copy);
	} else {
		return <></>;
	}
}

export default OfferStrapline;
