import { css } from '@emotion/react';
import {
	descriptionId,
	error,
	focusHalo,
	height,
	neutral,
	space,
} from '@guardian/source-foundations';
import type { LabelProps } from '@guardian/source-react-components';
import { InlineError, Label } from '@guardian/source-react-components';
import type {
	StripeCardElementOptions,
	StripeElementStyleVariant,
} from '@stripe/stripe-js';
import { useState } from 'react';

const inlineMessageMargin = css`
	margin-top: 2px;
`;

const stripeElementErrorStyles = css`
	& .StripeElement {
		border: 4px solid ${error[400]};
	}
`;

const stripeElementFocusStyles = css`
	& .StripeElement {
		${focusHalo}
	}
`;

const stripeElementStyles = (isFocused: boolean, error?: string) => css`
	display: block;

	& .StripeElement {
		margin-top: ${space[1]}px;
		height: ${height.inputMedium}px;
		border: 2px solid ${neutral[60]};
		padding: 10px ${space[2]}px;
	}

	${isFocused && stripeElementFocusStyles};

	${error && stripeElementErrorStyles}
`;

type ElementRenderProps = {
	id: string;
	options: StripeCardElementOptions;
	onFocus: () => void;
	onBlur: () => void;
};

type ElementDecoratorProps = LabelProps & {
	element: (renderProps: ElementRenderProps) => React.ReactNode;
	id: string;
	error?: string;
};

// Styles for stripe elements
const baseStyles: StripeElementStyleVariant = {
	fontSize: `${space[4]}px`,
	color: neutral[7],
	'::placeholder': {
		color: neutral[100],
	},
};

const invalidStyles: StripeElementStyleVariant = {
	color: error[400],
};

export function ElementDecorator({
	id,
	element,
	error,
	...labelProps
}: ElementDecoratorProps): JSX.Element {
	const [isFocused, setIsFocused] = useState<boolean>(false);

	return (
		<Label
			{...labelProps}
			htmlFor={id}
			cssOverrides={stripeElementStyles(isFocused, error)}
		>
			{error && (
				<div css={inlineMessageMargin}>
					<InlineError id={descriptionId(id)}>{error}</InlineError>
				</div>
			)}
			{element({
				id,
				options: {
					style: {
						base: { ...baseStyles },
						invalid: { ...invalidStyles },
					},
				},
				onFocus: () => setIsFocused(true),
				onBlur: () => setIsFocused(false),
			})}
		</Label>
	);
}
