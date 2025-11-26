import { isoCountries } from '@modules/internationalisation/country';
import { isoCurrencySchema } from '@modules/internationalisation/schemas';
import {
	billingPeriodSchema,
	fulfilmentOptionsSchema,
	productOptionsSchema,
} from '@modules/product/schemas';
import { optional, z } from 'zod';
import type { LegacyProductType } from 'helpers/legacyTypeConversions';
import { legacyProductTypes } from 'helpers/legacyTypeConversions';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import type { ActiveProductKey } from '../productCatalog';
import { isProductKey } from '../productCatalog';

/**
 * This file is used to validate data that gets injected from
 * the Play controllers onto the `window.guardian` object of the page.
 *
 * It will only error in NODE_ENV === 'development'.
 */
const PaymentConfigSchema = z.object({
	geoip: z.optional(
		z.object({
			countryCode: z.string(),
			stateCode: z.optional(z.string()),
		}),
	),
	stripeKeyDefaultCurrencies: z.object({
		ONE_OFF: z.object({ default: z.string(), test: z.string() }),
		REGULAR: z.object({ default: z.string(), test: z.string() }),
	}),
	stripeKeyAustralia: z.object({
		ONE_OFF: z.object({ default: z.string(), test: z.string() }),
		REGULAR: z.object({ default: z.string(), test: z.string() }),
	}),
	stripeKeyUnitedStates: z.object({
		ONE_OFF: z.object({ default: z.string(), test: z.string() }),
		REGULAR: z.object({ default: z.string(), test: z.string() }),
	}),
	stripeKeyTortoiseMedia: z.object({
		ONE_OFF: z.object({ default: z.string(), test: z.string() }),
		REGULAR: z.object({ default: z.string(), test: z.string() }),
	}),
	payPalEnvironment: z.object({
		default: z.string(),
		test: z.string(),
	}),
	mdapiUrl: z.string(),
	paymentApiPayPalEndpoint: z.string(),
	paymentApiUrl: z.string(),
	csrf: z.object({ token: z.string() }),
	guestAccountCreationToken: z.optional(z.string()),
	recaptchaEnabled: z.boolean(),
	v2recaptchaPublicKey: z.string(),
	user: z.optional(
		z.object({
			id: z.string(),
			email: z.optional(z.string()),
			firstName: z.optional(z.string()),
			lastName: z.optional(z.string()),
		}),
	),
	serversideTests: z.optional(z.object({})),
	settings: z.object({
		/**
		 * These keys are generated in Switches.scala
		 * @see {@link file://./../../../app/admin/settings/Switches.scala}
		 *
		 * And added to the `window.guardian` object in settingsScript.scala.html
		 * @see {@link file://./../../../app/views/settingsScript.scala.html}
		 */
		switches: z.object({
			oneOffPaymentMethods: z.record(
				z.string(),
				z.optional(z.enum(['On', 'Off'])),
			),
			recurringPaymentMethods: z.record(
				z.string(),
				z.optional(z.enum(['On', 'Off'])),
			),
			subscriptionsPaymentMethods: z.record(
				z.string(),
				z.optional(z.enum(['On', 'Off'])),
			),
			subscriptionsSwitches: z.record(
				z.string(),
				z.optional(z.enum(['On', 'Off'])),
			),
			featureSwitches: z.record(z.string(), z.optional(z.enum(['On', 'Off']))),
			campaignSwitches: z.record(z.string(), z.optional(z.enum(['On', 'Off']))),
			recaptchaSwitches: z.record(
				z.string(),
				z.optional(z.enum(['On', 'Off'])),
			),
		}),
		amounts: z.array(
			z.object({
				testName: z.string(),
				liveTestName: z.optional(z.string()),
				isLive: z.boolean(),
				order: z.number(),
				seed: z.number(),
				targeting: z.union([
					z.object({
						targetingType: z.literal('Region'),
						region: z.enum([
							'GBPCountries',
							'UnitedStates',
							'AUDCountries',
							'EURCountries',
							'NZDCountries',
							'Canada',
							'International',
						]),
					}),
					z.object({
						targetingType: z.literal('Country'),
						countries: z.array(z.enum(isoCountries)),
					}),
				]),
				variants: z.array(
					z.object({
						amountsCardData: z.object({
							ANNUAL: z.object({
								amounts: z.array(z.number()),
								defaultAmount: z.number(),
								hideChooseYourAmount: z.boolean(),
							}),
							MONTHLY: z.object({
								amounts: z.array(z.number()),
								defaultAmount: z.number(),
								hideChooseYourAmount: z.boolean(),
							}),
							ONE_OFF: z.object({
								amounts: z.array(z.number()),
								defaultAmount: z.number(),
								hideChooseYourAmount: z.boolean(),
							}),
						}),
						defaultContributionType: z.enum(['ONE_OFF', 'MONTHLY', 'ANNUAL']),
						displayContributionType: z.array(
							z.enum(['ONE_OFF', 'MONTHLY', 'ANNUAL']),
						),
						variantName: z.string(),
					}),
				),
			}),
		),
		contributionTypes: z.object({
			AUDCountries: z.array(
				z.object({
					contributionType: z.enum(['ONE_OFF', 'MONTHLY', 'ANNUAL']),
					isDefault: z.optional(z.boolean()),
				}),
			),
			Canada: z.array(
				z.object({
					contributionType: z.enum(['ONE_OFF', 'MONTHLY', 'ANNUAL']),
					isDefault: z.optional(z.boolean()),
				}),
			),
			EURCountries: z.array(
				z.object({
					contributionType: z.enum(['ONE_OFF', 'MONTHLY', 'ANNUAL']),
					isDefault: z.optional(z.boolean()),
				}),
			),
			GBPCountries: z.array(
				z.object({
					contributionType: z.enum(['ONE_OFF', 'MONTHLY', 'ANNUAL']),
					isDefault: z.optional(z.boolean()),
				}),
			),
			International: z.array(
				z.object({
					contributionType: z.enum(['ONE_OFF', 'MONTHLY', 'ANNUAL']),
					isDefault: z.optional(z.boolean()),
				}),
			),
			NZDCountries: z.array(
				z.object({
					contributionType: z.enum(['ONE_OFF', 'MONTHLY', 'ANNUAL']),
					isDefault: z.optional(z.boolean()),
				}),
			),
			UnitedStates: z.array(
				z.object({
					contributionType: z.enum(['ONE_OFF', 'MONTHLY', 'ANNUAL']),
					isDefault: z.optional(z.boolean()),
				}),
			),
		}),
		metricUrl: z.string(),
		productsWithThankYouOnboarding: z.array(
			z.string().refine<ActiveProductKey>(isProductKey),
		),
	}),
	isObserverSubdomain: z.boolean(),
});

const ProductCatalogSchema = z.object({
	productCatalog: z.record(
		z.string(),
		z.object({
			ratePlans: z.record(
				z.string(),
				z.object({
					id: z.string(),
					pricing: z.record(z.string(), z.number()),
					charges: z.record(
						z.string(),
						z.object({
							id: z.string(),
						}),
					),
					billingPeriod: z.optional(
						z.enum(['Quarter', 'Month', 'Annual', 'OneTime']),
					),
				}),
			),
		}),
	),
});

const countryKeySchema = z.enum([
	'United Kingdom',
	'Europe',
	'Australia',
	'New Zealand',
	'United States',
	'Canada',
	'International',
]);

export const dateTimeSchema = z.preprocess(
	(val) => (typeof val === 'string' ? new Date(val) : val),
	z.date(),
);
const promotionSchema = z.object({
	name: z.string(),
	description: z.string(),
	promoCode: z.string(),
	discountedPrice: optional(z.number()),
	numberOfDiscountedPeriods: optional(z.number()),
	discount: optional(
		z.object({
			amount: z.number(),
			durationMonths: z.number().optional(),
		}),
	),
	starts: dateTimeSchema,
	expires: dateTimeSchema.optional(),
});

export const ProductPricesSchema = z.object({
	allProductPrices: z.record(
		z.enum([...legacyProductTypes, 'GuardianWeeklyGift']),
		optional(
			z.record(
				countryKeySchema,
				z.record(
					fulfilmentOptionsSchema,
					z.record(
						productOptionsSchema,
						z.record(
							billingPeriodSchema,
							z.record(
								isoCurrencySchema,
								z.object({
									price: z.number(),
									savingVsRetail: z.number().optional(),
									currency: isoCurrencySchema,
									fixedTerm: z.boolean(),
									promotions: z.array(promotionSchema),
								}),
							),
						),
					),
				),
			),
		),
	),
});

const AppConfigSchema =
	PaymentConfigSchema.merge(ProductCatalogSchema).merge(ProductPricesSchema);

export type AppConfig = z.infer<typeof AppConfigSchema> & {
	allProductPrices: Partial<
		Record<LegacyProductType | 'GuardianWeeklyGift', ProductPrices>
	>;
};

export const parseAppConfig = (obj: unknown): AppConfig => {
	const appConfig = AppConfigSchema.safeParse(obj);
	if (appConfig.success) {
		return appConfig.data as AppConfig;
	} else {
		// We allow parsing errors through on PROD as they might not be breaking changes
		// but we should be aware of them.
		if (process.env.NODE_ENV === 'development') {
			console.error(appConfig.error);
			throw new SyntaxError(
				'Failed to parse window.guardian value with issues: ',
				{ cause: appConfig.error },
			);
		} else {
			console.error(
				'Failed to parse window.guardian value with issues: ',
				appConfig.error,
			);
		}
	}

	return obj as AppConfig;
};
