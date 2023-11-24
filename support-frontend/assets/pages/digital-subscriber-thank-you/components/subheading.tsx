function MarketingCopy(): JSX.Element {
	return (
		<span>
			Adjust your email preferences at any time via{' '}
			<a href="https://manage.theguardian.com">your account</a>.
		</span>
	);
}

function SubHeadingCopy() {
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
