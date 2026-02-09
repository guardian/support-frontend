// We only want to support the pay with PayPal option, so block all others.
// https://developer.paypal.com/sdk/js/configuration/#disable-funding
// There is an enable-funding option too, but it seems that this is for forcing
// specific funding options to appear, and does not cause other funding sources
// to not be shown.
// Note - this does not seem to be reliably honoured in the sandbox env, where I
// still see "PayPal Credit".
export const paypalSdkFundingBlocklist = [
	'credit',
	'paylater',
	'bancontact',
	'blik',
	'eps',
	'giropay',
	'ideal',
	'mercadopago',
	'mybank',
	'p24',
	'sepa',
	'sofort',
	'venmo',
];
