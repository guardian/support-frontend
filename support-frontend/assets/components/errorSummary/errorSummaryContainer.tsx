import { getAllErrorsForContributions } from 'helpers/redux/checkout/checkoutSelectors';
import { useContributionsSelector } from 'helpers/redux/storeHooks';
import type { CheckoutErrorSummaryProps } from './errorSummary';

function createErrorList(errors: Partial<Record<string, string[]>>) {
	return Object.entries(errors).flatMap(([fieldName, errorList]) => {
		if (!errorList) return [];
		return errorList.map((message) => ({ href: `#${fieldName}`, message }));
	});
}

type CheckoutErrorSummaryContainerProps = {
	renderSummary: (renderProps: CheckoutErrorSummaryProps) => JSX.Element | null;
};

export function CheckoutErrorSummaryContainer({
	renderSummary,
}: CheckoutErrorSummaryContainerProps): JSX.Element | null {
	const errors = useContributionsSelector(getAllErrorsForContributions);

	return renderSummary({
		errorList: createErrorList(errors),
	});
}
