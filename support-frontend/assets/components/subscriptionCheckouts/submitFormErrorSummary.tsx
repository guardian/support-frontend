// ----- Imports ----- //
import { css } from '@emotion/react';
import {
	error as errorColour,
	space,
	textSans,
} from '@guardian/source-foundations';
import { InlineError } from '@guardian/source-react-components';
import type { FormField } from 'helpers/subscriptionsForms/formFields';
import type { FormError } from 'helpers/subscriptionsForms/validation';
import type { CardFieldName } from './stripeForm/stripeForm';

const errorContainer = css`
	border: 4px ${errorColour[400]} solid;
	padding: ${space[3]}px;
	margin-top: ${space[6]}px;
`;
const errorMessage = css`
	${textSans.small()}
	display: list-item;
	list-style-position: outside;
	list-style-type: disc;
	margin-left: 32px;
`;
const boldText = css`
	font-weight: bold;
`;
// ----- Types ----- //
type PropTypes = {
	errors: Array<
		Record<string, string> | FormError<FormField> | FormError<CardFieldName>
	>;
};
// ----- Render ----- //
export function ErrorSummary(props: PropTypes): JSX.Element {
	return (
		<div role="status" aria-live="assertive" css={errorContainer}>
			<InlineError css={boldText}>Some information is missing</InlineError>
			<ul>
				{props.errors.map((error) => (
					<li key={error.message} css={errorMessage}>
						{error.message}
					</li>
				))}
			</ul>
		</div>
	);
}
