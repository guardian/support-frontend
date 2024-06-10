import type { InferOutput } from 'valibot';
import {
	array,
	boolean,
	intersect,
	literal,
	number,
	object,
	optional,
	picklist,
	record,
	safeParse,
	string,
	union,
} from 'valibot';
import { isoCountries } from 'helpers/internationalisation/country';

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
	amazonPayClientId: object({
		default: string(),
		test: string(),
	}),
	amazonPaySellerId: object({
		default: string(),
		test: string(),
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
			isSignedIn: boolean(),
		}),
	),
	/**
	 * productPrices, stragely, is valid as an empty object.
	 * We should be trying to avoid using this anywho, and use productCatalog instead.
	 */
	productPrices: object({}),
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
				}),
			),
		}),
	),
});

const WindowGuardianSchema = intersect([
	PaymentConfigSchema,
	ProductCatalogSchema,
]);

export type WindowGuardian = InferOutput<typeof WindowGuardianSchema>;

export const parseWindowGuardian = (obj: unknown) => {
	const windowGuardian = safeParse(WindowGuardianSchema, obj);
	if (windowGuardian.success) {
		return windowGuardian.output;
	} else {
		// We allow parsing errors through on PROD as they might not be breaking changes
		// but we should be aware of them.
		if (process.env.NODE_ENV === 'development') {
			throw new SyntaxError(
				'Failed to parse window.guardian value with issues: ',
				{ cause: windowGuardian.issues },
			);
		} else {
			console.error(
				'Failed to parse window.guardian value with issues: ',
				windowGuardian.issues,
			);
		}
	}

	return obj as WindowGuardian;
};
