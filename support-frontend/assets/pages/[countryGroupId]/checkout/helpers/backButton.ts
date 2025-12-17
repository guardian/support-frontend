import { routes } from 'helpers/urls/routes';

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
