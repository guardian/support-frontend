import { css } from '@emotion/react';
import { neutral, textSans, until } from '@guardian/source-foundations';
import { useRecaptchaV2 } from 'helpers/customHooks/useRecaptcha';

const container = css`
	${until.mobileMedium} {
		& > div {
			width: 0 !important;
			max-width: 100% !important;
		}
		iframe {
			transform: scale(0.82);
			transform-origin: top left;
		}
	}
`;

const terms = css`
	color: ${neutral[20]};
	${textSans.xxsmall()}

	margin-top: 5px;

	a {
		color: inherit;
	}
`;

export type RecaptchaProps = {
	id?: string;
	onRecaptchaCompleted: (token: string) => void;
	onRecaptchaExpired?: () => void;
};

export function Recaptcha({
	id = 'robot_checkbox',
	onRecaptchaCompleted,
	onRecaptchaExpired,
}: RecaptchaProps): JSX.Element {
	useRecaptchaV2(id, onRecaptchaCompleted, onRecaptchaExpired);

	return (
		<>
			<div id={id} css={container} />
			<p css={terms}>
				By ticking this box, you agree to let Google perform a security check to
				confirm you are a human. Please refer to their{' '}
				<a
					target="_blank"
					rel="noopener noreferrer"
					href="https://policies.google.com/terms"
				>
					Terms
				</a>{' '}
				and{' '}
				<a
					target="_blank"
					rel="noopener noreferrer"
					href="https://policies.google.com/privacy"
				>
					Privacy
				</a>{' '}
				policies.
			</p>
		</>
	);
}
