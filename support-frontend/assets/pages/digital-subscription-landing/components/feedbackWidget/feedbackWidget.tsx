// ----- Imports ----- //
// @ts-ignore - required for hooks
import React, { useEffect, useState } from 'react';
import { ThemeProvider } from 'emotion-theming';
import { Button, LinkButton, buttonBrand } from '@guardian/src-button';
import { sendTrackingEventsOnClick } from 'helpers/productPrice/subscriptions';
import {
	clickedCss,
	hideWidget,
	wrapper,
	widgetTitle,
	buttonStyles,
	feedbackLink,
	header,
} from './feedbackWidgetStyles';
import { SvgThumbsUp } from './thumbsUp';
import { SvgThumbsDown } from './thumbsDown';

function FeedbackWidget({ display }: { display: boolean }) {
	const [showWidget, setShowWidget] = useState<boolean>(display);
	const [clicked, setClicked] = useState({
		positive: false,
		negative: false,
		open: false,
	});
	const positiveButtonCss = clicked.positive ? clickedCss : null;
	const negativeButtonCss = clicked.negative ? clickedCss : null;
	useEffect(() => {
		setShowWidget(display);
	}, [display]);
	return (
		<aside css={[wrapper, showWidget ? '' : hideWidget]}>
			<fieldset role="group">
				<div css={header}>
					<p css={widgetTitle}>
						{clicked.negative
							? 'What can we improve?'
							: 'Is this page helpful?'}
					</p>
					<span>
						<ThemeProvider theme={buttonBrand}>
							<Button
								priority="subdued"
								size="small"
								hideLabel
								aria-label="Is this page helpful? Yes, this page has the information I am looking for"
								icon={<SvgThumbsUp />}
								cssOverrides={[positiveButtonCss, buttonStyles]}
								onClick={() => {
									sendTrackingEventsOnClick({
										id: 'ds_landing_page_survey_positive',
										product: 'DigitalPack',
										componentType: 'SURVEYS_QUESTIONS',
									})();
									setClicked({
										positive: true,
										negative: false,
									});
									setShowWidget(false);
								}}
							/>
						</ThemeProvider>
						<ThemeProvider theme={buttonBrand}>
							<Button
								priority="subdued"
								size="small"
								hideLabel
								aria-label="Is this page helpful? No, this page does not have the information I am looking for"
								icon={<SvgThumbsDown />}
								cssOverrides={[negativeButtonCss, buttonStyles]}
								onClick={() => {
									sendTrackingEventsOnClick({
										id: 'ds_landing_page_survey_negative',
										product: 'DigitalPack',
										componentType: 'SURVEYS_QUESTIONS',
									})();
									setClicked({
										positive: false,
										negative: true,
										open: !clicked.open,
									});
								}}
							/>
						</ThemeProvider>
					</span>
				</div>

				{clicked.open && (
					<div css={feedbackLink} aria-hidden={!clicked.negative}>
						<label htmlFor="feedbackLink" aria-live="assertive">
							Your feedback is really helpful; answer our two short questions to
							help us improve this page.
						</label>
						<LinkButton
							size="small"
							id="feedbackLink"
							aria-label="Click here to fill in a short survey about the information on this page"
							href="https://www.surveymonkey.co.uk/r/63XM7CX"
							target="_blank"
							rel="noopener noreferrer"
							onClick={() => setShowWidget(false)}
						>
							Tell us what you think
						</LinkButton>
					</div>
				)}
			</fieldset>
		</aside>
	);
}

export default FeedbackWidget;
