// ----- Imports ----- //
import { ThemeProvider } from '@emotion/react';
import { cmp } from '@guardian/consent-management-platform';
import {
	ButtonLink,
	Link,
	linkThemeBrand,
} from '@guardian/source-react-components';
import type { ReactNode } from 'react';
import { Children } from 'react';
import { copyrightNotice } from 'helpers/legal';
import Rows from '../base/rows';
import { BackToTop } from './BackToTop';
import FooterContent from './containers/FooterContent';
import {
	backToTopLink,
	componentFooter,
	copyright,
	link,
	linksList,
} from './footerStyles';
// ----- Props ----- //
type PropTypes = {
	centred: boolean;
	termsConditionsLink: string;
	children: ReactNode;
};

// ----- Component ----- //
function Footer({
	centred,
	children,
	termsConditionsLink,
}: PropTypes): JSX.Element {
	function showPrivacyManager() {
		cmp.showPrivacyManager();
	}

	return (
		<footer id="qa-footer" css={componentFooter} role="contentinfo">
			<ThemeProvider theme={linkThemeBrand}>
				{Children.count(children) > 0 && (
					<FooterContent
						appearance={{
							border: true,
							paddingTop: true,
							centred,
						}}
					>
						<div>
							<Rows>{children}</Rows>
						</div>
					</FooterContent>
				)}
				<FooterContent
					appearance={{
						border: true,
						centred,
					}}
				>
					<ul css={linksList}>
						<li css={link}>
							<Link href="https://manage.theguardian.com/help-centre">
								Help Centre
							</Link>
						</li>
						<li css={link}>
							<Link href="https://www.theguardian.com/help/contact-us">
								Contact us
							</Link>
						</li>
						<li css={link}>
							<Link
								subdued
								href="https://www.theguardian.com/help/privacy-policy"
							>
								Privacy Policy
							</Link>
						</li>
						<li css={link}>
							<ButtonLink onClick={showPrivacyManager}>
								Privacy Settings
							</ButtonLink>
						</li>
						{termsConditionsLink && (
							<li css={link}>
								<Link href={termsConditionsLink}>Terms & Conditions</Link>
							</li>
						)}
					</ul>
				</FooterContent>
				<FooterContent
					appearance={{
						centred,
					}}
				>
					<div css={backToTopLink}>
						<BackToTop />
					</div>
					<span css={copyright}>{copyrightNotice}</span>
				</FooterContent>
			</ThemeProvider>
		</footer>
	);
}

// ----- Default Props ----- //
Footer.defaultProps = {
	centred: false,
	termsConditionsLink: '',
	children: [],
}; // ----- Exports ----- //

export default Footer;
