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

/* The Stripe 'inputs' are actually iframes to forms on Stripe's own domain, which allows us to
take credit card payments without ever having to handle the hot potato that is card details.
These styles applied to the .StripeElement container that wraps each iframe make them look more or less
like our own inputs from Source.
*/
const stripeElementStyles = (isFocused: boolean, error?: string) => css`
	display: block;
	flex-grow: 1;

	& .StripeElement {
		margin-top: ${space[1]}px;
		height: ${height.inputMedium}px;
		border: 2px solid ${neutral[46]};
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
	renderElement: (renderProps: ElementRenderProps) => React.ReactNode;
	id: string;
	error?: string;
};

// Styles for stripe elements
const baseStyles: StripeElementStyleVariant = {
	fontSize: `${space[4]}px`,
	color: neutral[7],
};

/**
 * Provides a Source-based label, error message and focus state for a Stripe Elements component
 */
export function ElementDecorator({
	id,
	renderElement,
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
			{renderElement({
				id,
				options: {
					style: {
						base: { ...baseStyles },
					},
				},
				onFocus: () => setIsFocused(true),
				onBlur: () => setIsFocused(false),
			})}
		</Label>
	);
}
