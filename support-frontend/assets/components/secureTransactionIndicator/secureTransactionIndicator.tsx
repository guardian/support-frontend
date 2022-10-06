import { classNameWithModifiers } from 'helpers/utilities/utilities';
import './secureTransactionIndicator.scss';
import SecurePadlock from './securePadlock.svg';

type PropTypes = {
	modifierClasses: string[];
};

const text = 'Secure transaction';
export default function SecureTransactionIndicator({
	modifierClasses = [],
}: PropTypes): JSX.Element {
	return (
		<div
			className={classNameWithModifiers('component-secure-transaction', [
				...modifierClasses,
			])}
		>
			<SecurePadlock className="component-secure-transaction__padlock" />
			<div className="component-secure-transaction__text">{text}</div>
		</div>
	);
}
