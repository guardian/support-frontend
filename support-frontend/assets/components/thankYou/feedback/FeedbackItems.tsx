import { css } from '@emotion/react';
import { from } from '@guardian/source-foundations';
import {
	LinkButton,
	SvgArrowRightStraight,
} from '@guardian/source-react-components';
import { OPHAN_COMPONENT_ID_SURVEY } from 'helpers/thankYouPages/utils/ophan';
import { trackComponentClick } from 'helpers/tracking/behaviour';

const hideAfterTablet = css`
	display: block;

	${from.tablet} {
		display: none;
	}
`;
const hideBeforeTablet = css`
	display: none;

	${from.tablet} {
		display: block;
	}
`;

const getFeedbackHeader = (feedbackSurveyHasBeenCompleted: boolean): string => {
	return feedbackSurveyHasBeenCompleted
		? 'Thank you for sharing your thoughts'
		: 'Send your thoughts';
};

function FeedbackBodyCopy({
	feedbackSurveyHasBeenCompleted,
}: {
	feedbackSurveyHasBeenCompleted: boolean;
}): JSX.Element {
	return (
		<>
			{feedbackSurveyHasBeenCompleted ? (
				'You’re helping us deepen our understanding of Guardian supporters.'
			) : (
				<>
					<>
						<span css={hideAfterTablet}>
							Fill out this short form to tell us more about your experience of
							supporting us today – it only takes a minute.
						</span>

						<span css={hideBeforeTablet}>
							We would love to hear more about your experience of supporting the
							Guardian today. Please fill out this short form – it only takes a
							minute.
						</span>
					</>
				</>
			)}
		</>
	);
}

function FeedbackCTA({
	feedbackSurveyLink,
	onClick,
}: {
	feedbackSurveyLink: string;
	onClick?: () => void;
}): JSX.Element {
	const onSubmit = () => {
		trackComponentClick(OPHAN_COMPONENT_ID_SURVEY);
		onClick;
	};
	return (
		<LinkButton
			onClick={onSubmit}
			href={feedbackSurveyLink}
			target="_blank"
			rel="noopener noreferrer"
			priority="primary"
			size="default"
			icon={<SvgArrowRightStraight />}
			iconSide="right"
			nudgeIcon
		>
			Share your thoughts
		</LinkButton>
	);
}

export { getFeedbackHeader, FeedbackBodyCopy, FeedbackCTA };
