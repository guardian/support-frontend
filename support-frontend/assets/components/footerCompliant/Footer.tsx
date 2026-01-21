// ----- Imports ----- //
import { cmp } from '@guardian/libs';
import {
	ButtonLink,
	Link,
	themeLinkBrand,
} from '@guardian/source/react-components';
import type { ReactNode } from 'react';
import { Children } from 'react';
import {
	copyrightNotice,
	guardianContactUsLink,
	privacyLink,
} from 'helpers/legal';
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
	termsConditionsLink: string;
	children: ReactNode;
	centred: boolean;
	fullWidth?: boolean;
};

// ----- Component ----- //
function Footer({
	centred,
	children,
	termsConditionsLink,
	fullWidth,
}: PropTypes): JSX.Element {
	function showPrivacyManager() {
		cmp.showPrivacyManager();
	}

	return (
		<footer id="qa-footer" css={componentFooter} role="contentinfo">
			{Children.count(children) > 0 && (
				<FooterContent
					appearance={{
						border: true,
						paddingTop: true,
						centred,
						fullWidth,
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
					fullWidth,
				}}
			>
				<ul css={linksList}>
					<li css={link}>
						<Link
							href="https://manage.theguardian.com/help-centre"
							theme={themeLinkBrand}
						>
							Help Centre
						</Link>
					</li>
					<li css={link}>
						<Link href={guardianContactUsLink} theme={themeLinkBrand}>
							Contact us
						</Link>
					</li>
					<li css={link}>
						<Link subdued href={privacyLink} theme={themeLinkBrand}>
							Privacy Policy
						</Link>
					</li>
					<li css={link}>
						<ButtonLink onClick={showPrivacyManager} theme={themeLinkBrand}>
							Privacy Settings
						</ButtonLink>
					</li>
					{termsConditionsLink && (
						<li css={link}>
							<Link href={termsConditionsLink} theme={themeLinkBrand}>
								Terms & Conditions
							</Link>
						</li>
					)}
				</ul>
			</FooterContent>
			<FooterContent
				appearance={{
					centred,
					fullWidth,
				}}
			>
				<div css={backToTopLink}>
					<BackToTop />
				</div>
				<span css={copyright}>{copyrightNotice}</span>
			</FooterContent>
		</footer>
	);
}

// ----- Default Props ----- //
Footer.defaultProps = {
	centred: false,
	fullWidth: false,
	termsConditionsLink: '',
	children: [],
}; // ----- Exports ----- //

export default Footer;
