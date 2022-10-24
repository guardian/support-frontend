import {
	LinkButton,
	SvgArrowRightStraight,
} from '@guardian/source-react-components';
import { trackComponentClick } from 'helpers/tracking/behaviour';
import { OPHAN_COMPONENT_ID_AUS_MAP } from 'pages/contributions-landing/components/ContributionThankYou/utils/ophan';

const AUS_MAP_URL =
	'https://support.theguardian.com/aus-map?INTCMP=thankyou-page-aus-map-cta';

export const ausMapHeader = 'Hear from supporters across Australia';

export const ausMapBodyCopy =
	'Open up our interactive map to see messages from readers in every state. Learn why others chose to support Guardian Australia, and you can send us your thoughts too.';

export function AusMapCTA(): JSX.Element {
	return (
		<LinkButton
			onClick={() => trackComponentClick(OPHAN_COMPONENT_ID_AUS_MAP)}
			href={AUS_MAP_URL}
			target="_blank"
			rel="noopener noreferrer"
			priority="primary"
			size="default"
			icon={<SvgArrowRightStraight />}
			iconSide="right"
			nudgeIcon
		>
			View the map
		</LinkButton>
	);
}
