import { routes } from 'helpers/urls/routes';
import { addQueryParamsToURL } from 'helpers/urls/url';
import { getSourceContext } from './sessionStorage';

const validBackButtonPathOverrides: Record<string, string | undefined> = {
	subscribe: routes.subscriptionsLanding,
};

// If a valid override is provided, use that, otherwise fall back to the product
// description's landing page path
export const buildBackButtonPath = (
	defaultPath: string,
	backButtonPathOverride: string | null,
): string =>
	validBackButtonPathOverrides[backButtonPathOverride ?? ''] ?? defaultPath;

// Keeps the reader's ?source= and ?returnUrl= (saved by the landing page) on
// the way back, so "Change" lands on the same landing page they came from. The
// landing page clears them when it is opened without either.
export const addSourceContextToPath = (path: string): string => {
	const { source, returnUrl } = getSourceContext() ?? {};
	return addQueryParamsToURL(path, { source, returnUrl });
};
