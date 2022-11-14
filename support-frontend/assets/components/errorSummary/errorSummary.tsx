import { css } from '@emotion/react';
import { focusHalo, from, space } from '@guardian/source-foundations';
import { Link } from '@guardian/source-react-components';
import { ErrorSummary } from '@guardian/source-react-components-development-kitchen';
import { useAutoFocus } from 'helpers/customHooks/useAutoFocus';

const errorContainerStyles = css`
	margin-bottom: ${space[3]}px;

	${from.tablet} {
		margin-bottom: ${space[5]}px;
	}

	${from.desktop} {
		margin-bottom: ${space[6]}px;
	}

	:focus {
		${focusHalo};
	}
`;

const errorListStyles = css`
	list-style: disc;
	margin-bottom: ${space[1]}px;
`;

type CheckoutErrorLink = {
	href: string;
	message: string;
};

export type CheckoutErrorSummaryProps = {
	errorList: CheckoutErrorLink[];
};

export function CheckoutErrorSummary({
	errorList,
}: CheckoutErrorSummaryProps): JSX.Element | null {
	const containerRef = useAutoFocus<HTMLDivElement>();

	if (!errorList.length) return null;
	return (
		<div
			css={errorContainerStyles}
			role="alert"
			tabIndex={-1}
			ref={containerRef}
			aria-live="polite"
		>
			<ErrorSummary
				css={errorContainerStyles}
				message="Some information is missing"
				context={
					<ul css={errorListStyles}>
						{errorList.map(({ href, message }) => (
							<li>
								<Link
									data-qm-validation
									priority="secondary"
									href={href}
									subdued={true}
								>
									{message}
								</Link>
							</li>
						))}
					</ul>
				}
			/>
		</div>
	);
}
