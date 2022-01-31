// ----- Imports ----- //
import type { ReactNode } from 'react';
import React from 'react';
import 'helpers/types/option';
import { classNameWithModifiers } from 'helpers/utilities/utilities';
import './dialog.scss';

// ----- Props ----- //
export type PropTypes = {
	closeDialog: () => void;
	styled?: boolean;
	open?: boolean;
	blocking?: boolean;
	children: ReactNode;
};

// ----- Component ----- //
function Dialog({
	closeDialog,
	styled = true,
	open = false,
	blocking = true,
	children,
}: PropTypes): JSX.Element {
	return (
		<div
			className={classNameWithModifiers('component-dialog', [
				open ? 'open' : null,
				styled ? 'styled' : null,
			])}
			role="dialog"
			aria-modal={true}
			aria-hidden={!open}
			tabIndex={-1}
			onKeyUp={(ev) => {
				if (ev.key === 'Escape') {
					closeDialog();
				}
			}}
		>
			<div className="component-dialog__contents">{children}</div>
			<div
				className="component-dialog__backdrop"
				aria-hidden
				onClick={() => !blocking && closeDialog()}
			/>
		</div>
	);
}
// ----- Exports ----- //
export default Dialog;
