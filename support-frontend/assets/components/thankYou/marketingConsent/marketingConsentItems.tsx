import { css } from '@emotion/react';
import { from, space } from '@guardian/source-foundations';
import {
	Button,
	Checkbox,
	CheckboxGroup,
	SvgArrowRightStraight,
} from '@guardian/source-react-components';
import { useEffect } from 'react';
import { sendMarketingPreferencesToIdentity } from 'components/marketingConsent/helpers';
import type { CsrfState } from 'helpers/redux/checkout/csrf/state';
import { setThankYouMarketingConsent } from 'helpers/redux/checkout/thankYouState/actions';
import { useContributionsDispatch } from 'helpers/redux/storeHooks';
import { trackComponentClick } from 'helpers/tracking/behaviour';
import { isLocalHost } from 'helpers/urls/url';
import { OPHAN_COMPONENT_ID_MARKETING } from 'pages/contributions-landing/components/ContributionThankYou/utils/ophan';

const checkboxContainer = css`
	margin-top: ${space[2]}px;

	${from.desktop} {
		margin-top: ${space[5]}px;
	}
`;

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

type ThankYouMarketingConsentState = {
	marketingConsentState: {
		hasBeenCompleted: boolean;
		hasConsented: boolean;
		errorMessage: string | null;
	};
};

const ERROR_MESSAGE = "Please tick the box below, then click 'subscribe'";

export function ThankYouMarketingConsentBodyCopy({
	marketingConsentState,
}: ThankYouMarketingConsentState): JSX.Element {
	const dispatch = useContributionsDispatch();

	// reset error message when consent changes
	useEffect(() => {
		dispatch(
			setThankYouMarketingConsent({
				...marketingConsentState,
				errorMessage: '',
			}),
		);
	}, [marketingConsentState.hasConsented]);

	return (
		<>
			{marketingConsentState.hasBeenCompleted ? (
				<p>
					Please check your inbox for a confirmation link. Soon after, you’ll
					receive your first email from the Guardian newsroom. You can
					unsubscribe at any time.
				</p>
			) : (
				<>
					<p>
						<span css={hideAfterTablet}>
							Opt in to receive a regular newsletter from inside the Guardian.
						</span>

						<span css={hideBeforeTablet}>
							Our membership editor and others will discuss the most important
							recent news stories and suggest compelling articles to read. Opt
							in to receive their regular newsletter.
						</span>
					</p>
					<div css={checkboxContainer}>
						<CheckboxGroup
							name="marketing-consent"
							error={
								marketingConsentState.errorMessage
									? marketingConsentState.errorMessage
									: undefined
							}
						>
							<Checkbox
								value="marketing-consent"
								checked={marketingConsentState.hasConsented}
								onChange={() =>
									dispatch(
										setThankYouMarketingConsent({
											...marketingConsentState,
											hasConsented: !marketingConsentState.hasConsented,
										}),
									)
								}
								supporting="Stay up-to-date with our latest offers and the aims of the organisation, as well as the ways to enjoy and support our journalism."
							/>
						</CheckboxGroup>
					</div>
				</>
			)}
		</>
	);
}

function ThankYouMarketingConsentCTA({
	email,
	csrf,
	marketingConsentState,
}: {
	email: string;
	csrf: CsrfState;
} & ThankYouMarketingConsentState): JSX.Element {
	const dispatch = useContributionsDispatch();

	const subscribeToNewsLetter = (email: string, csrf: CsrfState) => {
		sendMarketingPreferencesToIdentity(true, email, dispatch, csrf);
	};

	const onSubmit = () => {
		if (!marketingConsentState.hasConsented) {
			dispatch(
				setThankYouMarketingConsent({
					...marketingConsentState,
					errorMessage: ERROR_MESSAGE,
				}),
			);
		} else {
			dispatch(
				setThankYouMarketingConsent({
					...marketingConsentState,
					hasBeenCompleted: true,
				}),
			);
			const isLocal = isLocalHost();
			if (isLocal) return;
			trackComponentClick(OPHAN_COMPONENT_ID_MARKETING);
			subscribeToNewsLetter(email, csrf);
		}
	};

	return (
		<Button
			onClick={onSubmit}
			priority="primary"
			size="default"
			icon={<SvgArrowRightStraight />}
			iconSide="right"
			nudgeIcon
		>
			Subscribe
		</Button>
	);
}

export default ThankYouMarketingConsentCTA;
