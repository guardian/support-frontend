// ----- Imports ----- //

import { css, ThemeProvider } from '@emotion/react';
import {
	from,
	headlineBold20,
	space,
	textSans17,
} from '@guardian/source/foundations';
import {
	buttonThemeReaderRevenue,
	LinkButton,
	SvgArrowRightStraight,
} from '@guardian/source/react-components';
import Content from 'components/content/contentSimple';

const subHeading = css`
	margin-bottom: ${space[1]}px;
	${headlineBold20};
	line-height: 1.4;
`;
const sansText = css`
	${textSans17}
	${from.desktop} {
		line-height: 1.4;
	}
`;
const maxWidth = css`
	${from.tablet} {
		max-width: 70%;
	}

	${from.leftCol} {
		max-width: 60%;
	}
`;
const marginForButton = css`
	margin: ${space[5]}px 0 0;
`;

function SubscriptionsSurvey(): JSX.Element | null {
	const surveyLink =
		'https://guardiannewsandmedia.formstack.com/forms/newspaper_subs_2022';
	const title = 'Tell us about your subscription';
	const message =
		'Please take this short survey to tell us why you purchased your subscription.';
	return (
		<Content>
			<section css={maxWidth}>
				<h3 css={subHeading}>{title}</h3>
				<p css={sansText}>{message}</p>
				<ThemeProvider theme={buttonThemeReaderRevenue}>
					<LinkButton
						cssOverrides={marginForButton}
						href={surveyLink}
						priority="tertiary"
						icon={<SvgArrowRightStraight />}
						iconSide="right"
						nudgeIcon
						aria-label="Link to subscription survey"
						target="_blank"
						rel="noopener noreferrer"
					>
						Share your thoughts
					</LinkButton>
				</ThemeProvider>
			</section>
		</Content>
	);
}

export default SubscriptionsSurvey;
