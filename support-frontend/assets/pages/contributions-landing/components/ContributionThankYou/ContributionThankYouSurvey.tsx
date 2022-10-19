import { css } from '@emotion/react';
import { space } from '@guardian/source-foundations';
import {
	LinkButton,
	SvgArrowRightStraight,
} from '@guardian/source-react-components';
import { useEffect, useState } from 'react';
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

const SURVEY_LINK = 'https://guardiannewsampampmedia.formstack.com/forms/guardian_contributions';
const AUS_SURVEY_LINK =
	'https://guardiannewsampampmedia.formstack.com/forms/australia_2022';

interface ContributionThankyouSurveyProps {
	countryId: string;
}

function ContributionThankYouSurvey({
	countryId,
}: ContributionThankyouSurveyProps): JSX.Element {
	const [hasBeenCompleted, setHasBeenCompleted] = useState(false);

	useEffect(() => {
		trackComponentLoad(OPHAN_COMPONENT_ID_SURVEY);
	}, []);

	const isAus = countryId === 'AU';

	const heading = isAus
		? 'Tell us why you value Guardian Australia'
		: 'Send us your thoughts';

	const actionIcon = <SvgSpeechBubbleWithPlus />;
	const actionHeader = (
		<ActionHeader
			title={hasBeenCompleted ? 'Thank you for sharing your thoughts' : heading}
		/>
	);

	const onClick = () => {
		trackComponentClick(OPHAN_COMPONENT_ID_SURVEY);
		setHasBeenCompleted(true);
	};

	const surveyLink = isAus ? AUS_SURVEY_LINK : SURVEY_LINK;

	const actionBody = (
		<ActionBody>
			{hasBeenCompleted ? (
				<p>
					You’re helping us deepen our understanding of Guardian supporters.
				</p>
			) : (
				<>
					<p>
						{isAus && (
							<span>
								We would love to know more about your decision to support our
								journalism today. We’ll publish a selection of our favourite
								messages, so other readers can enjoy them too.
							</span>
						)}

						{!isAus && (
							<>
								<span css={styles.hideAfterTablet}>
									Fill out this short form to tell us more about your experience
									of supporting us today – it only takes a minute.
								</span>

								<span css={styles.hideBeforeTablet}>
									We would love to hear more about your experience of supporting
									the Guardian today. Please fill out this short form – it only
									takes a minute.
								</span>
							</>
						)}
					</p>
					<div css={buttonContainer}>
						<LinkButton
							onClick={onClick}
							href={surveyLink}
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
