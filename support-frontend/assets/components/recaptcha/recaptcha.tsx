import './recaptcha.scss';

export type RecaptchaProps = {
	id?: string;
};

export function Recaptcha(
	{ id }: RecaptchaProps = { id: 'robot_checkbox' },
): JSX.Element {
	return (
		<>
			<div id={id} className="robot_checkbox" />
			<p className="recaptcha-terms">
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
