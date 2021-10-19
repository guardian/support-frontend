// ----- Imports ----- //
import React from 'react';
import { classNameWithModifiers } from 'helpers/utilities/utilities';
import './secureTransactionIndicator.scss';
import SecurePadlock from './securePadlock.svg';
// ----- Component ----- //
type PropTypes = {
	modifierClasses: string[];
};
const text = 'Secure transaction';
export default function SecureTransactionIndicator(props: PropTypes) {
	return (
		<div
			className={classNameWithModifiers('component-secure-transaction', [
				...props.modifierClasses,
			])}
		>
			<SecurePadlock className="component-secure-transaction__padlock" />
			<div className="component-secure-transaction__text">{text}</div>
		</div>
	);
}
SecureTransactionIndicator.defaultProps = {
	modifierClasses: [],
};
