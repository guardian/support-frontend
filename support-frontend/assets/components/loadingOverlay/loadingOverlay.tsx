import { css } from '@emotion/react';
import { neutral, textSans } from '@guardian/source-foundations';
import { useEffect } from 'react';
import AnimatedDots from 'components/spinners/animatedDots';

const loadingBackground = css`
	z-index: 10000;
	background-color: rgba(0, 0, 0, 0.6);
	position: fixed;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	overflow-x: hidden;
	overflow-y: auto;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const loadingMessage = css`
	${textSans.large()}
	color: ${neutral[100]};
	text-align: center;
`;

export type LoadingOverlayProps = {
	children: React.ReactNode;
};

export function LoadingOverlay({ children }: LoadingOverlayProps): JSX.Element {
	useEffect(() => {
		function preventKeydown(event: KeyboardEvent) {
			event.preventDefault();
		}

		document.body.addEventListener('keydown', preventKeydown, {
			capture: true,
		});

		return () =>
			document.body.removeEventListener('keydown', preventKeydown, {
				capture: true,
			});
	}, []);

	return (
		<div css={loadingBackground}>
			<div
				css={loadingMessage}
				role="alertdialog"
				aria-modal="true"
				aria-labelledby="loadingLabel"
			>
				<div id="loadingLabel">{children}</div>
				<AnimatedDots appearance="light" />
			</div>
		</div>
	);
}
