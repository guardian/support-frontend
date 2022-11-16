import { css } from '@emotion/react';
import { space } from '@guardian/source-foundations';
import { ErrorSummary } from '@guardian/source-react-components-development-kitchen';

const bottomSpacing = css`
	margin-bottom: ${space[6]}px;
`;

type NonValidationFailureMessageProps = {
	message: string;
	children: React.ReactNode;
};

export function NonValidationFailureMessage({
	message,
	children,
}: NonValidationFailureMessageProps): JSX.Element {
	return (
		<div role="alert" data-qm-error>
			<ErrorSummary
				cssOverrides={bottomSpacing}
				message={message}
				context={children}
			/>
		</div>
	);
}
