import { css } from '@emotion/react';
import { body, space } from '@guardian/source-foundations';
import {
	ButtonLink,
	LinkButton,
	SvgArrowRightStraight,
} from '@guardian/source-react-components';
import { useEffect, useState } from 'react';
import type { CsrfState } from 'helpers/redux/checkout/csrf/state';
import {
	trackComponentClick,
	trackComponentLoad,
} from 'helpers/tracking/behaviour';
import { routes } from 'helpers/urls/routes';
import { catchPromiseHandler } from 'helpers/utilities/promise';
import ActionBody from './components/ActionBody';
import ActionContainer from './components/ActionContainer';
import ActionHeader from './components/ActionHeader';
import BulletPointedList from './components/BulletPointedList';
import ExpandableContainer from './components/ExpandableContainer';
import SvgPersonWithTick from './components/SvgPersonWithTick';
import styles from './styles';
import {
	OPHAN_COMPONENT_ID_READ_MORE_SIGN_IN,
	OPHAN_COMPONENT_ID_SIGN_IN,
} from './utils/ophan';

const bodyText = css`
	${body.small()};
`;

const expandableContainer = css`
	margin-top: ${space[4]}px;

	& > * + * {
		margin-top: ${space[4]}px;
	}
`;

const buttonContainer = css`
	margin-top: ${space[6]}px;
`;

type ContributionThankYouSignInProps = {
	email: string;
	csrf: CsrfState;
};

type CreateSignInUrlResponse = {
	signInLink: string;
};

function ContributionThankYouSignIn({
	email,
	csrf,
}: ContributionThankYouSignInProps): JSX.Element {
	const [isExpanded, setIsExpanded] = useState(false);
	const [signInUrl, setSignInUrl] = useState('https://theguardian.com');

	useEffect(() => {
		const payload = {
			email,
		};
		fetch(routes.createSignInUrl, {
			method: 'post',
			headers: {
				'Csrf-Token': csrf.token ?? '',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(payload),
		})
			.then((response) => response.json())
			.then((data) =>
				setSignInUrl((data as CreateSignInUrlResponse).signInLink),
			)
			.catch(catchPromiseHandler('Error fetching sign in link'));
	}, []);

	useEffect(() => {
		trackComponentLoad(OPHAN_COMPONENT_ID_SIGN_IN);
	}, []);

	const actionIcon = <SvgPersonWithTick />;
	const actionHeader = <ActionHeader title="Continue to your account" />;

	const onSignInClick = () => trackComponentClick(OPHAN_COMPONENT_ID_SIGN_IN);

	const onReadMoreClick = () => {
		trackComponentClick(OPHAN_COMPONENT_ID_READ_MORE_SIGN_IN);
		setIsExpanded(true);
	};

	const actionBody = (
		<ActionBody>
			<p>
				<span css={styles.hideAfterTablet}>
					This means we can recognise you as a supporter and remove unnecessary
					messages asking for financial support.{' '}
					{!isExpanded && (
						<ButtonLink
							css={bodyText}
							priority="secondary"
							onClick={onReadMoreClick}
						>
							Read more
						</ButtonLink>
					)}
				</span>

				<span css={styles.hideBeforeTablet}>
					By signing in, you enable us to recognise you as a supporter across
					our website and apps. This means we will:
				</span>
			</p>
			<div css={styles.hideAfterTablet}>
				<ExpandableContainer isExpanded={isExpanded} maxHeight={500}>
					<div css={expandableContainer}>
						<p>
							You will be able to easily manage your recurring contributions,
							subscriptions and newsletters in one place.
						</p>

						<p>
							Make sure you sign in on each of the devices you use to read our
							journalism – either today or next time you use them.
						</p>
					</div>
				</ExpandableContainer>
			</div>
			<div css={styles.hideBeforeTablet}>
				<div css={expandableContainer}>
					<BulletPointedList
						items={[
							'Remove unnecessary messages asking you for financial support',
							'Let you easily manage your recurring contributions, subscriptions and newsletters in one place',
						]}
					/>

					<p>
						Make sure you sign in on each of the devices you use to read our
						journalism – either today or next time you use them.
					</p>
				</div>
			</div>
			<div css={buttonContainer}>
				<LinkButton
					onClick={onSignInClick}
					href={signInUrl}
					target="_blank"
					rel="noopener noreferrer"
					priority="primary"
					size="default"
					icon={<SvgArrowRightStraight />}
					iconSide="right"
					nudgeIcon
				>
					Continue
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
}

export default ContributionThankYouSignIn;
