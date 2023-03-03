// interface SubheadingProps {
// 	amountIsAboveSupporterPlusThreshold: boolean;
// 	isSignedIn: boolean;
// 	userTypeFromIdentityResponse: UserTypeFromIdentityResponse;
// 	contributionType?: ContributionType;
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
			Look out for your exclusive newsletter from our supporter editor. We’ll
			also be in touch with other great ways to get closer to Guardian
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
