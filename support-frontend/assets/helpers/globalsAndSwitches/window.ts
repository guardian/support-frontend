import { isoCountries } from '@modules/internationalisation/country';
import type { InferOutput } from 'valibot';
import {
	array,
	boolean,
	intersect,
	literal,
	looseObject,
	number,
	object,
	optional,
	picklist,
	record,
	safeParse,
	string,
	union,
} from 'valibot';
import type { LegacyProductType } from 'helpers/legacyTypeConversions';
import { legacyProductTypes } from 'helpers/legacyTypeConversions';
import type { ProductPrices } from 'helpers/productPrice/productPrices';

/**
 * This file is used to validate data that get's injected from
 * the Play controllers onto the `window.guardian` object of the page.
 *
 * It will only error in NODE_ENV === 'development'.
 */
const PaymentConfigSchema = object({
	geoip: optional(
		object({
			countryCode: string(),
			stateCode: optional(string()),
		}),
	),
	stripeKeyDefaultCurrencies: object({
		ONE_OFF: object({ default: string(), test: string() }),
		REGULAR: object({ default: string(), test: string() }),
	}),
	stripeKeyAustralia: object({
		ONE_OFF: object({ default: string(), test: string() }),
		REGULAR: object({ default: string(), test: string() }),
	}),
	stripeKeyUnitedStates: object({
		ONE_OFF: object({ default: string(), test: string() }),
		REGULAR: object({ default: string(), test: string() }),
	}),
	stripeKeyTortoiseMedia: object({
		ONE_OFF: object({ default: string(), test: string() }),
		REGULAR: object({ default: string(), test: string() }),
	}),
	payPalEnvironment: object({
		default: string(),
		test: string(),
	}),
	mdapiUrl: string(),
	paymentApiPayPalEndpoint: string(),
	paymentApiUrl: string(),
	csrf: object({ token: string() }),
	guestAccountCreationToken: optional(string()),
	recaptchaEnabled: boolean(),
	v2recaptchaPublicKey: string(),
	user: optional(
		object({
			id: string(),
			email: optional(string()),
			firstName: optional(string()),
			lastName: optional(string()),
		}),
	),
	serversideTests: optional(object({})),
	settings: object({
		/**
		 * These keys are generated in Switches.scala
		 * @see {@link file://./../../../app/admin/settings/Switches.scala}
		 *
		 * And added to the `window.guardian` object in settingsScript.scala.html
		 * @see {@link file://./../../../app/views/settingsScript.scala.html}
		 */
		switches: object({
			oneOffPaymentMethods: record(string(), optional(picklist(['On', 'Off']))),
			recurringPaymentMethods: record(
				string(),
				optional(picklist(['On', 'Off'])),
			),
			subscriptionsPaymentMethods: record(
				string(),
				optional(picklist(['On', 'Off'])),
			),
			subscriptionsSwitches: record(
				string(),
				optional(picklist(['On', 'Off'])),
			),
			featureSwitches: record(string(), optional(picklist(['On', 'Off']))),
			campaignSwitches: record(string(), optional(picklist(['On', 'Off']))),
			recaptchaSwitches: record(string(), optional(picklist(['On', 'Off']))),
		}),
		amounts: array(
			object({
				testName: string(),
				liveTestName: optional(string()),
				isLive: boolean(),
				order: number(),
				seed: number(),
				targeting: union([
					object({
						targetingType: literal('Region'),
						region: picklist([
							'GBPCountries',
							'UnitedStates',
							'AUDCountries',
							'EURCountries',
							'NZDCountries',
							'Canada',
							'International',
						]),
					}),
					object({
						targetingType: literal('Country'),
						countries: array(picklist(isoCountries)),
					}),
				]),
				variants: array(
					object({
						amountsCardData: object({
							ANNUAL: object({
								amounts: array(number()),
								defaultAmount: number(),
								hideChooseYourAmount: boolean(),
							}),
							MONTHLY: object({
								amounts: array(number()),
								defaultAmount: number(),
								hideChooseYourAmount: boolean(),
							}),
							ONE_OFF: object({
								amounts: array(number()),
								defaultAmount: number(),
								hideChooseYourAmount: boolean(),
							}),
						}),
						defaultContributionType: picklist(['ONE_OFF', 'MONTHLY', 'ANNUAL']),
						displayContributionType: array(
							picklist(['ONE_OFF', 'MONTHLY', 'ANNUAL']),
						),
						variantName: string(),
					}),
				),
			}),
		),
		contributionTypes: object({
			AUDCountries: array(
				object({
					contributionType: picklist(['ONE_OFF', 'MONTHLY', 'ANNUAL']),
					isDefault: optional(boolean()),
				}),
			),
			Canada: array(
				object({
					contributionType: picklist(['ONE_OFF', 'MONTHLY', 'ANNUAL']),
					isDefault: optional(boolean()),
				}),
			),
			EURCountries: array(
				object({
					contributionType: picklist(['ONE_OFF', 'MONTHLY', 'ANNUAL']),
					isDefault: optional(boolean()),
				}),
			),
			GBPCountries: array(
				object({
					contributionType: picklist(['ONE_OFF', 'MONTHLY', 'ANNUAL']),
					isDefault: optional(boolean()),
				}),
			),
			International: array(
				object({
					contributionType: picklist(['ONE_OFF', 'MONTHLY', 'ANNUAL']),
					isDefault: optional(boolean()),
				}),
			),
			NZDCountries: array(
				object({
					contributionType: picklist(['ONE_OFF', 'MONTHLY', 'ANNUAL']),
					isDefault: optional(boolean()),
				}),
			),
			UnitedStates: array(
				object({
					contributionType: picklist(['ONE_OFF', 'MONTHLY', 'ANNUAL']),
					isDefault: optional(boolean()),
				}),
			),
		}),
		metricUrl: string(),
	}),
});

const ProductCatalogSchema = object({
	productCatalog: record(
		string(),
		object({
			ratePlans: record(
				string(),
				object({
					id: string(),
					pricing: record(string(), number()),
					charges: record(
						string(),
						object({
							id: string(),
						}),
					),
					billingPeriod: optional(
						picklist(['Quarter', 'Month', 'Annual', 'OneTime']),
					),
				}),
			),
		}),
	),
});

/**
 * We parse productPrices through as a looseObject (no validation)
 * and then type it on the InferOutput using the existing types.
 *
 * This is partly because it is a model that needs refactoring now
 * we're moving into a more product focussed world, but also because
 * when creating the valibot schema we get this error
 * `Type instantiation is excessively deep and possibly infinite.`
 */
export const ProductPricesSchema = object({
	allProductPrices: record(
		picklist(legacyProductTypes),
		optional(looseObject({})),
	),
});

const AppConfigSchema = intersect([
	PaymentConfigSchema,
	ProductCatalogSchema,
	ProductPricesSchema,
]);

export type AppConfig = InferOutput<typeof AppConfigSchema> & {
	allProductPrices: Partial<Record<LegacyProductType, ProductPrices>>;
};

export const parseAppConfig = (obj: unknown): AppConfig => {
	const appConfig = safeParse(AppConfigSchema, obj);
	if (appConfig.success) {
		return appConfig.output as AppConfig;
	} else {
		// We allow parsing errors through on PROD as they might not be breaking changes
		// but we should be aware of them.
		if (process.env.NODE_ENV === 'development') {
			console.error(appConfig.issues);
			throw new SyntaxError(
				'Failed to parse window.guardian value with issues: ',
				{ cause: appConfig.issues },
			);
		} else {
			console.error(
				'Failed to parse window.guardian value with issues: ',
				appConfig.issues,
			);
		}
	}

	return obj as AppConfig;
};
