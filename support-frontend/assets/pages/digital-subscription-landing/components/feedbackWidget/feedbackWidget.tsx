// ----- Imports ----- //

import { ThemeProvider } from '@emotion/react';
import {
	Button,
	buttonThemeBrand,
	LinkButton,
} from '@guardian/source-react-components';
import { useEffect, useState } from 'react';
import { sendTrackingEventsOnClick } from 'helpers/productPrice/subscriptions';
import {
	buttonStyles,
	clickedCss,
	feedbackLink,
	header,
	hideWidget,
	widgetTitle,
	wrapper,
} from './feedbackWidgetStyles';
import { SvgThumbsDown } from './thumbsDown';
import { SvgThumbsUp } from './thumbsUp';

function FeedbackWidget({ display }: { display: boolean }): JSX.Element {
	const [showWidget, setShowWidget] = useState<boolean>(display);
	const [clicked, setClicked] = useState({
		positive: false,
		negative: false,
		open: false,
	});

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
						<ThemeProvider theme={buttonThemeBrand}>
							<Button
								priority="subdued"
								size="small"
								hideLabel
								aria-label="Is this page helpful? Yes, this page has the information I am looking for"
								icon={<SvgThumbsUp />}
								cssOverrides={
									clicked.positive ? [clickedCss, buttonStyles] : buttonStyles
								}
								onClick={() => {
									sendTrackingEventsOnClick({
										id: 'ds_landing_page_survey_positive',
										product: 'DigitalPack',
										componentType: 'SURVEYS_QUESTIONS',
									})();
									setClicked({
										...clicked,
										positive: true,
										negative: false,
									});
									setShowWidget(false);
								}}
							/>
						</ThemeProvider>
						<ThemeProvider theme={buttonThemeBrand}>
							<Button
								priority="subdued"
								size="small"
								hideLabel
								aria-label="Is this page helpful? No, this page does not have the information I am looking for"
								icon={<SvgThumbsDown />}
								cssOverrides={
									clicked.negative ? [clickedCss, buttonStyles] : buttonStyles
								}
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
							href=""
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
