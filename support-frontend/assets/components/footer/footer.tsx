// ----- Imports ----- //
import { Children } from 'react';
import type { ReactNode } from 'react';
import type { Appearance } from 'components/content/content';
import Content from 'components/content/content';
import ContribLegal from 'components/legal/contribLegal/contribLegal';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { GBPCountries } from 'helpers/internationalisation/countryGroup';
import { copyrightNotice, privacyLink } from 'helpers/legal';
import './footer.scss';
import Rows from '../base/rows';
import 'pages/digital-subscription-landing/components/digitalSubscriptionLanding.scss';

// ----- Props ----- //
type PropTypes = {
	privacyPolicy: boolean;
	disclaimer: boolean;
	countryGroupId: CountryGroupId;
	children: ReactNode;
	appearance: Appearance;
};

// ----- Component ----- //
function Footer({
	disclaimer,
	privacyPolicy,
	children,
	countryGroupId,
	appearance,
}: PropTypes): JSX.Element {
	return (
		<footer className="component-footer" role="contentinfo">
			{(disclaimer || privacyPolicy || Children.count(children) > 0) && (
				<Content appearance={appearance}>
					<div className="component-footer__content ">
						<Rows>
							{privacyPolicy && (
								<div className="component-footer__privacy-policy-text">
									To find out what personal data we collect and how we use it,
									please visit our
									<a
										className="component-footer__privacy-policy"
										href={privacyLink}
									>
										{' '}
										Privacy Policy
									</a>
									.
								</div>
							)}
							{children}
							{disclaimer && <ContribLegal countryGroupId={countryGroupId} />}
						</Rows>
					</div>
				</Content>
			)}
			<Content border appearance={appearance}>
				<span className="component-footer__copyright">{copyrightNotice}</span>
			</Content>
		</footer>
	);
}

// ----- Default Props ----- //
Footer.defaultProps = {
	privacyPolicy: false,
	disclaimer: false,
	appearance: 'feature',
	countryGroupId: GBPCountries,
	children: [],
};

// ----- Exports ----- //
export default Footer;
