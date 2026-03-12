import { css } from '@emotion/react';
import { from, headlineBold24, palette } from '@guardian/source/foundations';
import {
	getSanitisedHtml,
	replaceDatePlaceholder,
} from '../../../helpers/utilities/utilities';

const headingStyle = css`
	text-wrap: balance;
	text-align: left;
	color: ${palette.neutral[100]};
	${headlineBold24}
	${from.tablet} {
		text-align: center;
	}
	${from.desktop} {
		font-size: 2.625rem;
	}
`;

interface Props {
	heading: string;
	countdownDaysLeft?: string;
}

export function ThreeTierLandingHeading({
	heading,
	countdownDaysLeft,
}: Props): JSX.Element {
	return (
		<h1 css={headingStyle}>
			<span
				dangerouslySetInnerHTML={{
					__html: getSanitisedHtml(
						replaceDatePlaceholder(heading, countdownDaysLeft),
					),
				}}
			/>
		</h1>
	);
}
