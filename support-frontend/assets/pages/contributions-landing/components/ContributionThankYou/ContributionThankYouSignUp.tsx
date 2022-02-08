import { css } from '@emotion/react';
import { space } from '@guardian/src-foundations';
import React, { useEffect } from 'react';
import { trackComponentLoad } from 'helpers/tracking/behaviour';
import ActionBody from './components/ActionBody';
import ActionContainer from './components/ActionContainer';
import ActionHeader from './components/ActionHeader';
import BulletPointedList from './components/BulletPointedList';
import SvgPersonWithTick from './components/SvgPersonWithTick';
import { OPHAN_COMPONENT_ID_SIGN_UP } from './utils/ophan';

const listContainer = css`
	margin-top: ${space[4]}px;
`;

const ContributionThankYouSignUp: React.FC = () => {
	useEffect(() => {
		trackComponentLoad(OPHAN_COMPONENT_ID_SIGN_UP);
	}, []);
	const actionIcon = <SvgPersonWithTick />;
	const actionHeader = <ActionHeader title="Check your inbox" />;
	const actionBody = (
		<ActionBody>
			<p>
				As a supporter, you can benefit from a more tailored Guardian
				experience. So we can recognise you correctly, please open the email
				we’ve sent you and set a password – it takes less than a minute. By
				registering, and staying signed in to your account in the future, we
				will:
			</p>

			<div css={listContainer}>
				<BulletPointedList
					items={[
						'Reduce the number of messages we show asking you for financial support',
						'Make it easy to manage your contributions, subscriptions and newsletters in one place',
					]}
				/>
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

export default ContributionThankYouSignUp;
