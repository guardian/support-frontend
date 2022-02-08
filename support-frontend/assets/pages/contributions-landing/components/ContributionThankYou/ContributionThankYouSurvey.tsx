import { css } from '@emotion/react';
import { LinkButton } from '@guardian/src-button';
import { space } from '@guardian/src-foundations';
import { SvgArrowRightStraight } from '@guardian/src-icons';
import React, { useEffect, useState } from 'react';
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

function ContributionThankYouSurvey(): JSX.Element {
	const [hasBeenCompleted, setHasBeenCompleted] = useState(false);

	useEffect(() => {
		trackComponentLoad(OPHAN_COMPONENT_ID_SURVEY);
	}, []);

	const actionIcon = <SvgSpeechBubbleWithPlus />;
	const actionHeader = (
		<ActionHeader
			title={
				hasBeenCompleted
					? 'Thank you for sharing your thoughts'
					: 'Send us your thoughts'
			}
		/>
	);

	const onClick = () => {
		trackComponentClick(OPHAN_COMPONENT_ID_SURVEY);
		setHasBeenCompleted(true);
	};

	const actionBody = (
		<ActionBody>
			{hasBeenCompleted ? (
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
							href="https://www.surveymonkey.co.uk/r/VDQ32ND"
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
