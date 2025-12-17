import type { ProductDescription } from 'helpers/productCatalog';
import { routes } from 'helpers/urls/routes';

const validBackButtonPathOverrides: Record<string, string | undefined> = {
	subscriptionsLanding: routes.subscriptionsLanding,
};

// If a valid override is provided, use that, otherwise fall back to the product
// description's landing page path
export const buildBackButtonPath = (
	productDescription: ProductDescription,
	backButtonPathOverride: string | null,
): string =>
	validBackButtonPathOverrides[backButtonPathOverride ?? ''] ??
	productDescription.landingPagePath;
