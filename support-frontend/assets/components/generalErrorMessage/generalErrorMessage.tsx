// ----- Imports ----- //
import type { ReactNode } from 'react';
import type { ErrorReason } from 'helpers/forms/errorReasons';
import { appropriateErrorMessage } from 'helpers/forms/errorReasons';
import type { Option } from 'helpers/types/option';
import { classNameWithModifiers } from 'helpers/utilities/utilities';
import SvgExclamationAlternate from '../svgs/exclamationAlternate';
import 'helpers/types/option';
import './generalErrorMessage.scss';

// ---- Types ----- //
type PropTypes = {
	errorReason: Option<ErrorReason> | string;
	errorHeading: string;
	svg: ReactNode;
	classModifiers: Array<string | null | undefined>;
};

// ----- Component ----- //
export default function GeneralErrorMessage(
	props: PropTypes,
): JSX.Element | null {
	if (props.errorReason) {
		return (
			<div
				role="status"
				aria-live="assertive"
				className={classNameWithModifiers(
					'component-general-error-message',
					props.classModifiers,
				)}
			>
				{props.svg}
				<span className="component-general-error-message__error-heading">
					{props.errorHeading}
				</span>
				<span className="component-general-error-message__small-print">
					{appropriateErrorMessage(props.errorReason)}
				</span>
			</div>
		);
	}

	return null;
}

// ----- Default Props ----- //
GeneralErrorMessage.defaultProps = {
	errorHeading: 'Payment Attempt Failed',
	svg: <SvgExclamationAlternate />,
	classModifiers: [],
};
