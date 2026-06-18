import { css } from '@emotion/react';
import type { ReactNode } from 'react';
import 'helpers/types/option';

const dialog = css`
	all: initial;
	position: absolute;
	visibility: hidden;
	height: 0;
	width: 0;
	overflow: hidden;
	-moz-osx-font-smoothing: grayscale;
	-webkit-font-smoothing: antialiased;
	&::backdrop {
		background: rgba(0, 0, 0, 0);
	}
`;

const openCss = css`
	visibility: visible;
	position: fixed;
	height: 100%;
	width: 100%;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	z-index: 100;
	contain: strict;
`;
const styledCss = css`
	background: rgba(0, 0, 0, 0.6);
`;

const backdrop = css`
	position: fixed;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	z-index: 9;
	height: 100%;
	width: 100%;
`;

type PropTypes = {
	closeDialog: () => void;
	styled?: boolean;
	open?: boolean;
	blocking?: boolean;
	children: ReactNode;
};

function Dialog({
	closeDialog,
	styled = true,
	open = false,
	blocking = true,
	children,
}: PropTypes): JSX.Element {
	return (
		<div
			css={[dialog, open && openCss, styled && styledCss]}
			role="dialog"
			// Adding a test ID as when the dialog is hidden, it cannot be selected by its ARIA role
			data-testid="dialog"
			aria-modal={true}
			aria-hidden={!open}
			tabIndex={-1}
			onKeyUp={(ev) => {
				if (ev.key === 'Escape') {
					closeDialog();
				}
			}}
		>
			<div
				css={css`
					position: relative;
					z-index: 10;
				`}
			>
				{children}
			</div>
			<div
				css={backdrop}
				aria-hidden
				data-testid="dialog-backdrop"
				onClick={() => !blocking && closeDialog()}
			/>
		</div>
	);
}

export default Dialog;
