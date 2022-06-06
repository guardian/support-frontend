import { css } from '@emotion/react';
import {
	// brandAlt,
	from,
	// headline,
	// neutral,
	// space,
} from '@guardian/source-foundations';
import type { ReactElement, ReactNode } from 'react';
import { offerStraplineBlue } from 'stylesheets/emotion/colours';

const offerStraplineStyles = css`
	max-width: 100%;
	width: fit-content;
	margin-bottom: 0;
	background-color: ${offerStraplineBlue};

	${from.tablet} {
		max-width: 50%;
	}
`;

type PropTypes = {
	// children?: ReactNode;
	copy?: ReactNode;
};

function OfferStrapline({
	// children,
	// cssOverrides,
	// theme = 'base',
	copy,
}: PropTypes): ReactElement {
	// RJR comment: I refuse to believe this is the best way to make sure the last word doesn't fall onto its own line! But I don't know how else to get React to accept '&nbsp;' being inserted between the last word and its predecessor...
	const noWidowWord = (c: ReactNode) => {
		if (typeof c === 'string') {
			const trimmedCopy = c.trim();
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
							css={offerStraplineStyles}
							dangerouslySetInnerHTML={getResult()}
						/>
					);
				}
			}
		}
		return <div css={offerStraplineStyles}>c</div>;
	};

	// const testCopy =
	//     "Some really long and boring text about not much at all except that it's really, really long and tedious";

	if (copy) {
		// return noWidowWord(testCopy);
		return noWidowWord(copy);
	} else {
		return <></>;
	}
}

// HeroRoundel.defaultProps = {
// 	theme: 'base',
// };

export default OfferStrapline;
