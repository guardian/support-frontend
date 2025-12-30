// ----- Imports ----- //
import type { ReactNode } from 'react';
import 'helpers/types/option';
import './label.scss';
import { footerContainer, optionalItalics } from './labelStyles';
// ----- Types ----- //
export type WithLabelProps = {
	label: string;
	id?: string;
	optional?: boolean;
	footer?: ReactNode;
	labelId?: string;
};
type Props = WithLabelProps & {
	htmlFor?: string;
	children: ReactNode;
};

// ----- Component ----- //
function Label({
	label,
	children,
	footer,
	htmlFor,
	optional,
	labelId,
}: Props): JSX.Element {
	const Element = htmlFor ? 'label' : 'strong';

	return (
		<div className="component-form-label">
			<Element
				className="component-form-label__label"
				id={labelId}
				htmlFor={htmlFor}
			>
				{label}
				{optional && <span css={optionalItalics}>Optional</span>}
			</Element>
			{children}
			{footer && <div css={footerContainer}>{footer}</div>}
		</div>
	);
}

Label.defaultProps = {
	footer: null,
	optional: false,
	labelId: '',
};
// ----- Exports ----- //
export { Label };
