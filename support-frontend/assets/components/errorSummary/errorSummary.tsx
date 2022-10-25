import { Link } from '@guardian/source-react-components';
import { ErrorSummary } from '@guardian/source-react-components-development-kitchen';
import { useAutoFocus } from 'helpers/customHooks/useAutoFocus';

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
		<div aria-live="polite" tabIndex={-1} ref={containerRef}>
			<ErrorSummary
				message="Some information is missing"
				context={
					<ul>
						{errorList.map(({ href, message }) => (
							<li>
								<Link priority="secondary" href={href}>
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
