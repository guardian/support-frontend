import { css } from '@emotion/react';
import { space } from '@guardian/source-foundations';
import {
	LinkButton,
	SvgArrowRightStraight,
} from '@guardian/source-react-components';
import { useEffect } from 'react';
import { setThankYouFeedbackSurveyHasBeenCompleted } from 'helpers/redux/checkout/thankYouState/actions';
import {
	useContributionsDispatch,
	useContributionsSelector,
} from 'helpers/redux/storeHooks';
import {
	trackComponentClick,
	trackComponentLoad,
} from 'helpers/tracking/behaviour';
import ActionBody from './components/ActionBody';
import ActionContainer from './components/ActionContainer';
import ActionHeader from './components/ActionHeader';
import SvgSpeechBubbleWithPlus from './components/SvgSpeechBubbleWithPlus';
import styles from './styles';
import { OPHAN_COMPONENT_ID_SURVEY } from './utils/ophan';

const buttonContainer = css`
	margin-top: ${space[6]}px;
`;

const SURVEY_LINK =
	'https://guardiannewsandmedia.formstack.com/forms/guardian_contributions';

function ContributionThankYouSurvey(): JSX.Element {
	const { feedbackSurveyHasBeenCompleted } = useContributionsSelector(
		(state) => state.page.checkoutForm.thankYou,
	);

	const dispatch = useContributionsDispatch();

	useEffect(() => {
		trackComponentLoad(OPHAN_COMPONENT_ID_SURVEY);
	}, []);

	const actionIcon = <SvgSpeechBubbleWithPlus />;
	const actionHeader = (
		<ActionHeader
			title={
				feedbackSurveyHasBeenCompleted
					? 'Thank you for sharing your thoughts'
					: 'Send us your thoughts'
			}
		/>
	);

	const onClick = () => {
		trackComponentClick(OPHAN_COMPONENT_ID_SURVEY);
		dispatch(setThankYouFeedbackSurveyHasBeenCompleted(true));
	};

	const actionBody = (
		<ActionBody>
			{feedbackSurveyHasBeenCompleted ? (
				<p>
					You’re helping us deepen our understanding of Guardian supporters.
				</p>
			) : (
				<>
					<p>
						<span css={styles.hideAfterTablet}>
							Fill out this short form to tell us more about your experience of
							supporting us today – it only takes a minute.
						</span>

						<span css={styles.hideBeforeTablet}>
							We would love to hear more about your experience of supporting the
							Guardian today. Please fill out this short form – it only takes a
							minute.
						</span>
					</p>
					<div css={buttonContainer}>
						<LinkButton
							onClick={onClick}
							href={SURVEY_LINK}
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
					</div>
				</>
			)}
		</ActionBody>
	);

	return (
		<ActionContainer
			icon={actionIcon}
			header={actionHeader}
			body={actionBody}
		/>
	);
}

export default ContributionThankYouSurvey;
