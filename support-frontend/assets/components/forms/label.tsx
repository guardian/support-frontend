import type { ReactNode } from 'react';
import 'helpers/types/option';
import './label.scss';
import {
	footerContainer,
	labelContainer,
	optionalItalics,
} from './labelStyles';

export type WithLabelProps = {
	label: string;
	optional?: boolean;
	footer?: ReactNode;
	id?: string;
};
type LabelProps = WithLabelProps & {
	htmlFor?: string;
	children: ReactNode;
};

export default function Label({
	label,
	children,
	optional = false,
	footer = null,
	id = '',
	htmlFor,
}: LabelProps): JSX.Element {
	const Element = htmlFor ? 'label' : 'strong';
	return (
		<div css={labelContainer}>
			<Element
				className="component-form-label__label"
				id={id}
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
