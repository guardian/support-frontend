import { css } from '@emotion/react';
import { until } from '@guardian/source/foundations';
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

type RecaptchaProps = {
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
		</>
	);
}
