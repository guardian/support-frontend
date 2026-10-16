/**
 * One-off script to export an aggregate, anonymised breakdown of Stripe
 * subscriptions by price/currency and payment status (no customer or
 * subscription identifiers, or any other PII, are included).
 *
 * Includes subscriptions in "active" and "unpaid" status (unpaid meaning
 * Stripe's dunning/retry attempts have been exhausted and the subscription is
 * still considered a customer we want to track, just with outstanding
 * payments), flagged via the payments_up_to_date column.
 *
 * Requires a Stripe API key, passed via the STRIPE_API_KEY env var. Fetch
 * the restricted key named "Customer / Product Read Only" directly from the
 * Stripe dashboard (Developers > API keys) - do not use a full secret key.
 *
 * Usage:
 *   STRIPE_API_KEY=rk_live_xxx node list-subscribers.js [output.csv]
 */

const fs = require('fs');

const apiKey = process.env.STRIPE_API_KEY;
if (!apiKey) {
	console.error(
		'Error: STRIPE_API_KEY environment variable is required.\n' +
			'Fetch the restricted key named "Customer / Product Read Only" directly from the Stripe dashboard (Developers > API keys).',
	);
	process.exit(1);
}

const Stripe = require('stripe');

// Subscription statuses we want in the extract. See
// https://stripe.com/docs/api/subscriptions/object#subscription_object-status
const INCLUDED_STATUSES = ['active', 'unpaid'];
const outputPath = process.argv[2] || 'subscribers.csv';

function csvEscape(value) {
	const str = value === undefined || value === null ? '' : String(value);
	if (/[",\n]/.test(str)) {
		return `"${str.replace(/"/g, '""')}"`;
	}
	return str;
}

function toCsvRow(fields) {
	return fields.map(csvEscape).join(',');
}

async function main() {
	const stripe = new Stripe(apiKey);

	const rows = [['price_id', 'currency', 'payments_up_to_date']];

	let count = 0;

	// The Stripe Node SDK's list responses are async-iterable and
	// auto-paginate under the hood, so this will fetch all pages across all
	// statuses; we then keep only the ones we care about below.
	for await (const subscription of stripe.subscriptions.list({
		status: 'all',
		limit: 100,
	})) {
		if (!INCLUDED_STATUSES.includes(subscription.status)) continue;

		const priceIds = subscription.items.data
			.map((item) => item.price && item.price.id)
			.filter(Boolean)
			.join('; ');

		const currencies = subscription.items.data
			.map((item) => item.price && item.price.currency && item.price.currency.toUpperCase())
			.filter(Boolean)
			.join('; ');

		const paymentsUpToDate = subscription.status === 'active' ? 'yes' : 'no';

		rows.push([priceIds, currencies, paymentsUpToDate]);

		count += 1;
	}

	const csv = rows.map(toCsvRow).join('\n');
	fs.writeFileSync(outputPath, csv);

	console.log(`Wrote ${count} subscription(s) to ${outputPath}`);
}

main().catch((err) => {
	console.error('Failed to export Stripe subscribers:', err);
	process.exit(1);
});
