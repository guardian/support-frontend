import { css } from '@emotion/react';
import { space } from '@guardian/source/foundations';
import {
	LinkButton,
	SvgArrowRightStraight,
} from '@guardian/source/react-components';
import { useEffect, useState } from 'react';
import BulletPointedList from 'components/thankYou/utilityComponents/BulletPointedList';
import type { CsrfState } from 'helpers/redux/checkout/csrf/state';
import { routes } from 'helpers/urls/routes';
import { isCodeOrProd } from 'helpers/urls/url';
import { catchPromiseHandler } from 'helpers/utilities/promise';

const expandableContainer = css`
	margin-top: ${space[4]}px;

	& > * + * {
		margin-top: ${space[4]}px;
	}
`;

type SignedInBodyCopyProps = {
	email?: string;
	csrf: CsrfState;
};

type CreateSignInUrlResponse = {
	signInLink: string;
};

export const signedInHeader = 'Continue to your account';

export function SignedInBodyCopy(): JSX.Element {
	const upperCopy = `By signing in, you help us to recognise you as a valued supporter when you visit our website or app. This means we can:`;
	const lowerCopy = `Make sure you sign in on each of the devices you use to read our journalism – either today or next time you use them.`;
	const advantagesList = [
		'Show you far fewer requests for financial support',
		'Offer you a simple way to manage your support payments and newsletter subscriptions',
	];

	return (
		<>
			<p>
				<span>{upperCopy}</span>
			</p>
			<div>
				<div css={expandableContainer}>
					<BulletPointedList items={advantagesList} />

					<p>{lowerCopy}</p>
				</div>
			</div>
		</>
	);
}

export function SignedInCTA({
	email,
	csrf,
}: SignedInBodyCopyProps): JSX.Element {
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

	return (
		<LinkButton
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
