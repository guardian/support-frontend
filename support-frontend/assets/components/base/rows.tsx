// ----- Imports ----- //
import type { ReactNode } from 'react';
import React from 'react';
import { classNameWithModifiers } from 'helpers/utilities/utilities';
import './rows.scss';

// ----- Types ----- //
type PropTypes = {
	gap: 'small' | 'normal' | 'large';
	children: ReactNode;
	className: string | null | undefined;
};

// ----- Component ----- //
function Rows({ children, className, gap, ...props }: PropTypes): JSX.Element {
	return (
		<div
			className={[
				className,
				classNameWithModifiers('component-base-rows', [gap]),
			].join(' ')}
			{...props}
		>
			{children}
		</div>
	);
}

Rows.defaultProps = {
	gap: 'normal',
	className: null,
}; // ----- Exports ----- //

export default Rows;
