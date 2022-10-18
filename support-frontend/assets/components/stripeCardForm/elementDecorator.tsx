import { css } from '@emotion/react';
import {
	descriptionId,
	error,
	height,
	neutral,
	space,
} from '@guardian/source-foundations';
import type { LabelProps } from '@guardian/source-react-components';
import { InlineError, Label } from '@guardian/source-react-components';

const inlineMessageMargin = css`
	margin-top: 2px;
`;

const stripeElementStyles = css`
	display: block;

	& .StripeElement {
		margin-top: ${space[1]}px;
		height: ${height.inputMedium}px;
		border: 2px solid ${neutral[60]};
		padding: 10px ${space[2]}px;
	}
`;

const stripeElementErrorStyles = css`
	& .StripeElement {
		border: 4px solid ${error[400]};
	}
`;

type ElementDecoratorProps = LabelProps & {
	children: React.ReactNode;
	id: string;
	error?: string;
};

function getElementStyles(error?: string) {
	if (error) {
		return [stripeElementStyles, stripeElementErrorStyles];
	}
	return stripeElementStyles;
}

export function ElementDecorator({
	children,
	id,
	error,
	...labelProps
}: ElementDecoratorProps): JSX.Element {
	return (
		<Label {...labelProps} htmlFor={id} cssOverrides={getElementStyles(error)}>
			{error && (
				<div css={inlineMessageMargin}>
					<InlineError id={descriptionId(id)}>{error}</InlineError>
				</div>
			)}
			{children}
		</Label>
	);
}
