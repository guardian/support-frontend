import 'components/adFreeSection/adFreeSection.scss';
import 'pages/digital-subscription-landing/components/digitalSubscriptionLanding.scss';

function AdFreeSection(): JSX.Element {
	return (
		<div className="ad-free-section__content">
			<h3 className="ad-free-section__sub-header">Ad-free web</h3>
			<p className="ad-free-section__copy">
				Read the Guardian&apos;s quality, independent journalism without
				interruptions. Enjoy an ad-free experience across all of your devices
				when you&apos;re signed in on your apps and theguardian.com
			</p>
		</div>
	);
}

export default AdFreeSection;
