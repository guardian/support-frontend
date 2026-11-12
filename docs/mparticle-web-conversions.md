# mParticle web conversions

The shared generic checkout thank-you tracker can send purchases through the mParticle Web SDK and Google Ads Kit on both the standard thank-you page and onboarding. The feature supports every product and rate plan handled by that tracker. It is disabled until `enableMParticleConversions` is enabled and `mparticle.web.apiKey` is configured.

The browser sends the commerce event to mParticle and the Google Ads Kit sends the conversion to Google. Native forwarding appears in mParticle's dashboard. Posting an event with curl does not execute this browser kit. See the [mParticle Google Ads web integration](https://docs.mparticle.com/integrations/google-ads/event/#web-integration).

`SuccessfulConversion` uses `googleAdsConversionSource: 'mparticle'` for the native route and `'gtm'` for the GTM route. Other GTM consumers remain available when GTM consent allows them. Selecting the native route suppresses the GTM Google Ads conversion through a remotely configured exception; there is no automatic GTM retry if the SDK fails, because a failure cannot prove that Google received nothing.

**Configure the destinations before enabling the switch**

1. Inventory the current Google Ads conversion actions for every product and rate plan. Record each exact `conversionKey`, conversion ID and conversion label. Labels identify conversion actions and are not transaction IDs. The previously tested `SupporterPlus:Monthly` example used conversion ID `969657754` and label `M2kJCInYod0ZEJqbr84D`; obtain the correct values for every other plan rather than reusing that example globally.
2. In mParticle, create Google Ads event output configurations and connect them to the **Web** input in the intended environment. Enable the Google Site Tag, leave Remarketing Only off, and leave Enhanced Conversions off. Disable any separate Web → Google Enhanced Conversions connection. In each connection, map **Commerce - Purchase** to the correct label. These settings are described in [mParticle's Google Ads configuration reference](https://docs.mparticle.com/integrations/google-ads/event/#configuration-settings).
3. Give each connection an **Only Forward → Event Attribute → conversionKey** rule matching exactly one `productType:ratePlan`, such as `SupporterPlus:Monthly`. Multiple Google Ads configurations can use the same label when those plans intentionally share an action, with a distinct exact filter for each plan. Every purchase must match exactly one intended connection. An unfiltered Commerce - Purchase → monthly label mapping would send other products to the wrong action. Each configuration initialises its own kit, so validate that a purchase reaches only its intended conversion action and that shared Google consent settings agree across all configurations. Complete all mappings before enabling this global feature switch.
4. Register the `personalised_advertising` consent purpose in the workspace. Have the consent owner confirm which Google consent signals it may represent and configure the corresponding mappings/defaults consistently across the Google Ads connections and GTM. A default of Granted is not evidence of the user's choice. Google's [consent-mode guidance](https://developers.google.com/tag-platform/security/concepts/consent-mode) distinguishes collecting consent, communicating it and enforcing it.
5. In GTM, add a Data Layer Variable for `googleAdsConversionSource`. Create a Custom Event exception for `SuccessfulConversion` with the condition that this variable equals `mparticle`. Add it **only to the Google Ads conversion tags** served by this tracker. Preserve the existing consent exceptions, Conversion Linker, remarketing and unrelated tags. Preview and publish this exception before enabling native conversions; when the source is `gtm` or absent, existing conversion triggers continue to work. See [GTM trigger exceptions](https://support.google.com/tagmanager/answer/7679316).

The native purchase includes the existing amount, currency and session-scoped transaction ID, with these event attributes:

| Attribute          | Example / meaning                                                            |
| ------------------ | ---------------------------------------------------------------------------- |
| `productType`      | `SupporterPlus`                                                              |
| `ratePlan`         | Exact plan key, such as `Monthly`, `AnnualTaxExclusive` or `ThreeMonthGift`  |
| `billingPeriod`    | `Monthly`, `Quarterly`, `Annual` or `OneTime`                                |
| `conversionKey`    | Exact `productType:ratePlan`; use this for connection filters                |
| `contributionType` | `MONTHLY`, `QUARTERLY`, `ANNUAL` or `ONE_OFF`                                |
| `paymentMethod`    | Existing payment method, with Stripe express checkout normalised to `Stripe` |

Quarterly is represented correctly in the native payload; the existing GTM contribution-type contract is retained. Tax-exclusive, gift, student and print-package plans retain their exact rate-plan keys, even where they share a billing period.

For the one-off contribution route without product/plan query parameters, the existing tracker defaults produce `Contribution:OneTime`. Include that exact key in the mapping inventory rather than assuming `OneTimeContribution:OneTime`.

**Configure Support Frontend locally**

In DEV, the application reads `/etc/gu/support-frontend.private.conf` first, then `/support/frontend/DEV` from AWS Parameter Store, then `DEV.public.conf`. The local file is optional; when present, its values override Parameter Store. The application does not create this file.

`support-frontend/fetch-config.sh` downloads the existing shared DEV config from `s3://membership-private/DEV/support-frontend.private.conf` using the `membership` AWS profile. It is not run by `devrun.sh`, does not create the mParticle key, and overwrites the local file if run again. It expects `/etc/gu` to exist and be writable.

For a local-only override, add the public Web input key to `/etc/gu/support-frontend.private.conf`:

```hocon
mparticle.web.apiKey = "YOUR_PUBLIC_WEB_INPUT_KEY"
```

Create `/etc/gu` if needed, then restart the application after changing configuration. The browser receives only `mParticleConversions: { apiKey, isDevelopmentMode }`; do not put a server API secret or OAuth credential here, or commit a real key to the repository. DEV and CODE use development mode. PROD uses production mode except for recognised test users, who use development mode. The SDK endpoints are configured for the EU region.

Development mode selects the mParticle environment and connection settings; it does not provide a Google Ads sandbox. The kit still sends real requests to the configured Google Ads conversion action, so use the intended test action when validating.

After preparing the matching development connections and GTM preview exception, open `/switches` locally and enable `enableMParticleConversions` as a local override. The override works even before the remote switch exists. Missing keys and disabled switches retain the GTM route. Remove the local override after testing. Enable the remote switch only after the full destination matrix and GTM exception are ready for that environment.

**Consent and identity behaviour**

The native route waits for permission for both the `mparticle` and `remarketing` vendors before loading the SDK. If mParticle consent is denied while both Google remarketing and GTM consent are allowed, the existing GTM route is selected instead. Otherwise, a queued conversion can proceed when an eligible consent route becomes available while the page remains mounted. Leaving the page or withdrawing permission discards pending native work. Withdrawal opts the SDK out and pauses this native route until reload; granting consent again on the same page does not replay the purchase. Google advertising consent signals are denied when Google permission is withdrawn and restored if it is regranted. Withdrawing only mParticle permission does not deny otherwise permitted Google tags.

The integration supplies no email, customer ID or other explicit identity fields. The SDK still collects browser/device/session and page URL metadata and may reuse an identity already persisted by an earlier SDK session. Use a fresh browser profile when validating anonymous behaviour. Do not treat this as a promise that the SDK transmits no personal data.

The transaction ID remains the existing session-scoped `orderId`. It is created only after the selected sender's consent checks pass and reused for repeated page loads; native dispatch is guarded against repeated attempts during the page runtime. It is not the Lambda's subscription/order identifier and does not join browser and server events. This change does not modify Lambda payloads or credentials.

**Validate using local or CODE test checkout**

Use the existing test-user/test-payment flow; a real production payment is unnecessary. Open DevTools on the **Support Frontend tab**, enable Network recording and Preserve log, and select **All** request types. Open GTM Preview against that same site. Use a fresh browser session for each independent purchase so the existing session transaction ID does not collapse separate tests.

| Check               | Expected result                                                                                                                                                                         |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Standard thank-you  | With `enableThankYouOnboarding` off, complete a test purchase. One native purchase is dispatched with its exact product/plan mapping.                                                   |
| Onboarding          | With onboarding enabled and the product listed in `productsWithThankYouOnboarding`, complete the test flow without a session skip override. The same shared tracker sends the purchase. |
| Product/plan matrix | Exercise each configured conversion key, including annual, quarterly, one-time, gift/student and print plans where supported. Only its intended output forwards.                        |
| GTM ownership       | `SuccessfulConversion` has source `mparticle`; Google Ads conversion tags are blocked by the new exception. Other applicable GTM tags still behave normally.                            |
| Default route       | With the conversion switch off, source is `gtm`, the existing conversion tag fires, and this integration does not load the SDK.                                                         |
| Initial consent     | Native dispatch waits for mParticle and remarketing consent. If mParticle is denied while remarketing and GTM are allowed, source is `gtm` and the existing Google Ads tag can fire without loading the SDK. |
| Withdrawal          | Withdraw permission before dispatch: no pending purchase is replayed. After SDK initialisation, withdrawal opts out; regrant requires reload to start a new native lifecycle.           |
| Reload/remount      | There is no second native dispatch within the page runtime. Reload retains the existing transaction ID; do not interpret it as a new order.                                             |

In mParticle Live Stream, select the correct environment, Web input, relevant Google Ads output and **both inbound and outbound** messages. Match the commerce event to the `GoogleAdWords` forwarded message and its `conversionKey`. In the browser Network panel, filter by the configured conversion ID and inspect the Google conversion request: the label, transaction ID (`oid`), amount and currency must agree with the purchase. Confirm one logical conversion dispatch for the intended action, allowing for Google's auxiliary requests, with no parallel GTM conversion or dispatch from an unmatched kit configuration. A successful HTTP response such as 200 confirms that the request reached Google's endpoint. Together with native forwarding, this validates the browser integration, but does not prove Google Ads campaign attribution or reporting eligibility.

Before activation, retain evidence that:

- [ ] Every supported product/plan has one correct output mapping in the target environment.
- [ ] The GTM exception is published and Enhanced Conversions is disabled on the relevant Web connections.
- [ ] The workspace purpose and Google consent mappings reflect the approved CMP policy.
- [ ] Standard thank-you, onboarding, consent and single-sender checks pass.

The dependencies are pinned to Web SDK `2.81.0` and Google Ads Kit `2.3.2`. The isolated production-dependency audit on 2026-11-10 reported no known vulnerabilities; repeat that audit when changing these versions. Repository-wide advisories outside this dependency subset are a separate result.
