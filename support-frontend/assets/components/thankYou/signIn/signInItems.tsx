import { css } from '@emotion/react';
import { body, from, space } from '@guardian/source/foundations';
import {
	ButtonLink,
	LinkButton,
	SvgArrowRightStraight,
} from '@guardian/source/react-components';
import { useEffect, useState } from 'react';
import BulletPointedList from 'components/thankYou/utilityComponents/BulletPointedList';
import ExpandableContainer from 'components/thankYou/utilityComponents/ExpandableContainer';
import type { CsrfState } from 'helpers/redux/checkout/csrf/state';
import {
	OPHAN_COMPONENT_ID_READ_MORE_SIGN_IN,
	OPHAN_COMPONENT_ID_SIGN_IN,
} from 'helpers/thankYouPages/utils/ophan';
import { trackComponentClick } from 'helpers/tracking/behaviour';
import { routes } from 'helpers/urls/routes';
import { isCodeOrProd } from 'helpers/urls/url';
import { catchPromiseHandler } from 'helpers/utilities/promise';

const bodyText = css`
	${body.small()};
`;

const expandableContainer = css`
	margin-top: ${space[4]}px;

	& > * + * {
		margin-top: ${space[4]}px;
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

type SignInBodyCopyProps = {
	email?: string;
	csrf: CsrfState;
};

type CreateSignInUrlResponse = {
	signInLink: string;
};

export const signInHeader = 'Continue to your account';

export function SignInBodyCopy(): JSX.Element {
	const [isExpanded, setIsExpanded] = useState(false);

	const onReadMoreClick = () => {
		trackComponentClick(OPHAN_COMPONENT_ID_READ_MORE_SIGN_IN);
		setIsExpanded(true);
	};

	return (
		<>
			<p>
				<span css={hideAfterTablet}>
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

				<span css={hideBeforeTablet}>
					By signing in, you help us to recognise you as a valued supporter when
					you visit our website or app. This means we can:
				</span>
			</p>
			<div css={hideAfterTablet}>
				<ExpandableContainer isExpanded={isExpanded} maxHeight={500}>
					<div css={expandableContainer}>
						<p>You will be able to easily manage your account in one place.</p>

						<p>
							Make sure you sign in on each of the devices you use to read our
							journalism – either today or next time you use them.
						</p>
					</div>
				</ExpandableContainer>
			</div>
			<div css={hideBeforeTablet}>
				<div css={expandableContainer}>
					<BulletPointedList
						items={[
							'Show you far fewer requests for financial support',
							'Offer you a simple way to manage your support payments and newsletter subscriptions',
						]}
					/>

					<p>
						Make sure you sign in on each of the devices you use to read our
						journalism – either today or next time you use them.
					</p>
				</div>
			</div>
		</>
	);
}

export function SignInCTA({ email, csrf }: SignInBodyCopyProps): JSX.Element {
	const [signInUrl, setSignInUrl] = useState('https://theguardian.com');

	function fetchSignInLink(payload: { email: string }) {
		if (!isCodeOrProd()) {
			return;
		}

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
	}

	useEffect(() => {
		if (email) {
			const payload = {
				email,
			};

			fetchSignInLink(payload);
		}
	}, []);

	const onSignInClick = () => trackComponentClick(OPHAN_COMPONENT_ID_SIGN_IN);

	return (
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
	);
}
