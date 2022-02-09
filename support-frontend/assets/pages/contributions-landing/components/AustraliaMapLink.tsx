import { ThemeProvider } from '@emotion/react';
import {
	buttonThemeBrandAlt,
	LinkButton,
	SvgArrowRightStraight,
} from '@guardian/source-react-components';
import { trackComponentClick } from 'helpers/tracking/behaviour';

function AustraliaMapLink() {
	return (
		<section className="contribution-thank-you-block">
			<h3 className="contribution-thank-you-block__title">
				Hear from supporters across Australia
			</h3>
			<p className="contribution-thank-you-block__message">
				Open up our interactive map to see messages from readers in every state.
				Learn why others chose to support Guardian Australia, and you can send
				us your thoughts too.
			</p>
			<ThemeProvider theme={buttonThemeBrandAlt}>
				<LinkButton
					target="_blank"
					icon={<SvgArrowRightStraight />}
					iconSide="right"
					nudgeIcon
					href="https://support.theguardian.com/aus-map?INTCMP=thankyou-page-aus-map-cta"
					onClick={() => trackComponentClick('contribution-thankyou-aus-map')}
				>
					View the map
				</LinkButton>
			</ThemeProvider>
		</section>
	);
}

export default AustraliaMapLink;
