import { css } from '@emotion/react';
import { space } from '@guardian/source-foundations';
import {
	LinkButton,
	SvgArrowRightStraight,
} from '@guardian/source-react-components';
import { useEffect } from 'react';
import * as React from 'react';
import {
	trackComponentClick,
	trackComponentLoad,
} from 'helpers/tracking/behaviour';
import ActionBody from './components/ActionBody';
import ActionContainer from './components/ActionContainer';
import ActionHeader from './components/ActionHeader';
import SvgAusMap from './components/SvgAusMap';
import { OPHAN_COMPONENT_ID_AUS_MAP } from './utils/ophan';

const buttonContainer = css`
	margin-top: ${space[6]}px;
`;

const AUS_MAP_URL =
	'https://support.theguardian.com/aus-map?INTCMP=thankyou-page-aus-map-cta';

const ContributionThankYouAusMap: React.FC = () => {
	useEffect(() => {
		trackComponentLoad(OPHAN_COMPONENT_ID_AUS_MAP);
	}, []);

	const actionIcon = <SvgAusMap />;
	const actionHeader = (
		<ActionHeader title="Hear from supporters across Australia" />
	);
	const actionBody = (
		<ActionBody>
			<p>
				Open up our interactive map to see messages from readers in every state.
				Learn why others chose to support Guardian Australia, and you can send
				us your thoughts too.
			</p>
			<div css={buttonContainer}>
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
			</div>
		</ActionBody>
	);

	return (
		<ActionContainer
			icon={actionIcon}
			header={actionHeader}
			body={actionBody}
		/>
	);
};

export default ContributionThankYouAusMap;
