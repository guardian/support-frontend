// interface SubheadingProps {
// 	amountIsAboveSupporterPlusThreshold: boolean;
// 	isSignedIn: boolean;
// 	userTypeFromIdentityResponse: UserTypeFromIdentityResponse;
//  billingPeriod: BillingPeriod // Monthly or Annual for kindle subscribers
// }

function MarketingCopy(): JSX.Element {
	return (
		<span>
			Adjust your email preferences at any time via{' '}
			<a href="https://manage.theguardian.com">your account</a>.
		</span>
	);
}

function SubHeadingCopy() {
	// The following would allow us to display different copy depending on:
	// - whether the user is signed in
	// - whether the selected amount is above a specified threshold amount
	//
	// const maybeIsSignedIn =
	// 	userTypeFromIdentityResponse === 'current' || isSignedIn
	// 		? 'isSignedIn'
	// 		: 'notSignedIn';
	//
	// const recurringCopy = (amountIsAboveSupporterPlusThreshold: boolean) => {
	// 	return {
	// 		isSignedIn: amountIsAboveSupporterPlusThreshold ? (
	// 			<span>Signed In Above Threshold</span>
	// 		) : (
	// 			<span>Signed In Below Threshold</span>
	// 		),
	// 		notSignedIn: amountIsAboveSupporterPlusThreshold ? (
	// 			<span>NOT Signed In Above Threshold</span>
	// 		) : (
	// 			<span>NOT Signed In Below Threshold</span>
	// 		),
	// 	};
	// };
	//
	// return recurringCopy(amountIsAboveSupporterPlusThreshold)[maybeIsSignedIn];

	return (
		<span>
			You have now unlocked access to the Guardian and Observer newspapers,
			which you can enjoy across all your devices, wherever you are in the
			world. Soon, you will receive weekly newsletters from our supporter
			editor. We'll also be in touch with other ways to get closer to our
			journalism.{' '}
		</span>
	);
}

function Subheading(): JSX.Element {
	return (
		<>
			<SubHeadingCopy />
			<MarketingCopy />
		</>
	);
}

export default Subheading;
