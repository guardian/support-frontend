import type { SerializedStyles } from '@emotion/react';
import type { FormHTMLAttributes, ReactNode } from 'react';
import Heading from 'components/heading/heading';
import type { HeadingSize } from 'components/heading/heading';
import './checkoutForm.scss';

type TitleProps =
	| {
			title?: ReactNode;
			titleComponent?: never;
	  }
	| {
			title?: never;
			titleComponent?: ReactNode;
	  };

type FormSectionPropTypes = TitleProps & {
	id?: string;
	children: ReactNode;
	headingSize: HeadingSize;
	border: 'full' | 'bottom' | 'top' | 'none';
	cssOverrides?: SerializedStyles;
};

function FormSection({
	children,
	title,
	titleComponent,
	headingSize,
	border,
	id,
	cssOverrides,
}: FormSectionPropTypes): JSX.Element {
	return (
		<div
			id={id}
			className={`component-checkout-form-section component-checkout-form-section--${border} component-checkout-form-section__wrap`}
			css={titleComponent && cssOverrides}
		>
			{titleComponent && titleComponent}
			{title && (
				<Heading
					className="component-checkout-form-section__heading"
					size={headingSize}
				>
					{title}
				</Heading>
			)}
			{children}
		</div>
	);
}

FormSection.defaultProps = {
	headingSize: 2,
	title: null,
	border: 'full',
	id: '',
	cssOverrides: null,
};
// Hidden version of form section
type FormSectionHiddenPropTypes = {
	title?: string;
	children: ReactNode;
	headingSize: HeadingSize;
	show?: boolean;
	id?: string;
};

function FormSectionHiddenUntilSelected({
	children,
	title,
	headingSize,
	show,
	id,
}: FormSectionHiddenPropTypes): JSX.Element {
	return (
		<div
			id={id}
			className={
				show
					? 'component-checkout-form-section'
					: 'component-checkout-form-section is-hidden'
			}
		>
			{show && (
				<div className="component-checkout-form-section__wrap">
					{title && (
						<Heading
							className="component-checkout-form-section__heading"
							size={headingSize}
						>
							{title}
						</Heading>
					)}
					{children}
				</div>
			)}
		</div>
	);
}

FormSectionHiddenUntilSelected.defaultProps = {
	headingSize: 2,
	title: null,
	show: false,
	id: '',
};

/*
Form
the top level form itself
*/
type FormPropTypes = FormHTMLAttributes<HTMLFormElement> & {
	children: ReactNode;
};

function Form({ children, ...otherProps }: FormPropTypes): JSX.Element {
	return (
		<form {...otherProps} className="component-checkout-form">
			{children}
		</form>
	);
}

export default Form;
export { FormSection, FormSectionHiddenUntilSelected };
