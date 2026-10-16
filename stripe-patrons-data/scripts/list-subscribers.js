/**
 * One-off script to export a list of Stripe customers/subscribers and the
 * products they are subscribed to.
 *
 * The Stripe API key is read from Parameter Store (same location used by the
 * stripe-patrons-data lambdas:
 * /<stage>/support/stripe-patrons-data/stripe-config/api-key), using AWS
 * credentials from the "membership" profile. Set STRIPE_API_KEY to bypass
 * Parameter Store and supply a key directly instead.
 *
 * Usage:
 *   node list-subscribers.js [output.csv]
 *
 * Env vars:
 *   STAGE                       - PROD (default) or CODE
 *   AWS_PROFILE                 - defaults to "membership"
 *   STRIPE_API_KEY              - overrides Parameter Store lookup
 *   STRIPE_SUBSCRIPTION_STATUS  - defaults to "active". See
 *     https://stripe.com/docs/api/subscriptions/list for valid values.
 */

const fs = require('fs');
const { SSMClient, GetParametersByPathCommand } = require('@aws-sdk/client-ssm');
const { fromIni } = require('@aws-sdk/credential-providers');

const stage = process.env.STAGE || 'PROD';
const awsProfile = process.env.AWS_PROFILE || 'membership';

async function getApiKeyFromParameterStore() {
	const client = new SSMClient({
		region: 'eu-west-1',
		credentials: fromIni({ profile: awsProfile }),
	});

	const path = `/${stage}/support/stripe-patrons-data/stripe-config`;
	const response = await client.send(
		new GetParametersByPathCommand({
			Path: path,
			Recursive: false,
			WithDecryption: true,
		}),
	);

	const param = (response.Parameters || []).find((p) => p.Name === `${path}/api-key`);
	if (!param) {
		throw new Error(`Could not find ${path}/api-key in Parameter Store`);
	}
	return param.Value;
}

const Stripe = require('stripe');

const status = process.env.STRIPE_SUBSCRIPTION_STATUS || 'active';
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
	const apiKey = process.env.STRIPE_API_KEY || (await getApiKeyFromParameterStore());
	const stripe = new Stripe(apiKey);

	const rows = [
		['customer_id', 'email', 'name', 'subscription_id', 'price_id', 'currency'],
	];

	let count = 0;

	// The Stripe Node SDK's list responses are async-iterable and
	// auto-paginate under the hood, so this will fetch all pages.
	for await (const subscription of stripe.subscriptions.list({
		status,
		limit: 100,
		expand: ['data.customer'],
	})) {
		// Skip anything that isn't genuinely active (defensive; the API call
		// above already filters on `status`, but this guards against any
		// unexpected/invalid records slipping through).
		if (subscription.status !== 'active') continue;

		const customer = subscription.customer;

		const priceIds = subscription.items.data
			.map((item) => item.price && item.price.id)
			.filter(Boolean)
			.join('; ');

		const currencies = subscription.items.data
			.map((item) => item.price && item.price.currency && item.price.currency.toUpperCase())
			.filter(Boolean)
			.join('; ');

		rows.push([
			typeof customer === 'object' ? customer.id : customer,
			typeof customer === 'object' ? customer.email : '',
			typeof customer === 'object' ? customer.name : '',
			subscription.id,
			priceIds,
			currencies,
		]);

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
