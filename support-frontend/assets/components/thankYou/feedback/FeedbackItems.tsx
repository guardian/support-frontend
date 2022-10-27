import {
	LinkButton,
	SvgArrowRightStraight,
} from '@guardian/source-react-components';
import type { IsoCountry } from 'helpers/internationalisation/country';
import { setThankYouFeedbackSurveyHasBeenCompleted } from 'helpers/redux/checkout/thankYouState/actions';
import { useContributionsDispatch } from 'helpers/redux/storeHooks';
import { trackComponentClick } from 'helpers/tracking/behaviour';
import styles from 'pages/contributions-landing/components/ContributionThankYou/styles';
import { OPHAN_COMPONENT_ID_SURVEY } from 'pages/contributions-landing/components/ContributionThankYou/utils/ophan';

const getFeedbackHeader = (
	countryId: IsoCountry,
	feedbackSurveyHasBeenCompleted: boolean,
): string => {
	const isAus = countryId === 'AU';

	const heading = isAus
		? 'Tell us why you value Guardian Australia'
		: 'Send us your thoughts';

	return feedbackSurveyHasBeenCompleted
		? 'Thank you for sharing your thoughts'
		: heading;
};

function FeedbackBodyCopy({
	countryId,
	feedbackSurveyHasBeenCompleted,
}: {
	countryId: IsoCountry;
	feedbackSurveyHasBeenCompleted: boolean;
}): JSX.Element {
	const isAus = countryId === 'AU';

	return (
		<>
			{feedbackSurveyHasBeenCompleted ? (
				'You’re helping us deepen our understanding of Guardian supporters.'
			) : (
				<>
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
				</>
			)}
		</>
	);
}

function FeedbackCTA({ countryId }: { countryId: IsoCountry }): JSX.Element {
	const dispatch = useContributionsDispatch();

	const isAus = countryId === 'AU';

	// PLACEHOLDER LINK - to be updated before v2 launch
	const SURVEY_LINK =
		'https://guardiannewsampampmedia.formstack.com/forms/guardian_contributions';
	const AUS_SURVEY_LINK =
		'https://guardiannewsampampmedia.formstack.com/forms/australia_2022';

	const surveyLink = isAus ? AUS_SURVEY_LINK : SURVEY_LINK;

	const onClick = () => {
		trackComponentClick(OPHAN_COMPONENT_ID_SURVEY);
		dispatch(setThankYouFeedbackSurveyHasBeenCompleted(true));
	};

	return (
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
	);
}

export { getFeedbackHeader, FeedbackBodyCopy, FeedbackCTA };
