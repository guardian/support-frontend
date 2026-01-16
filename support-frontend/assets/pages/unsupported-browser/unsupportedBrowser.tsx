import { Header } from 'components/headers/simpleHeader/simpleHeader';
import 'stylesheets/gu-sass/gu-sass.scss';
import 'stylesheets/skeleton/fonts.scss';
import 'stylesheets/skeleton/reset-src.scss';
import { PageScaffold } from 'components/page/pageScaffold';
import Footer from './components/footer';
import {
	container,
	gu_content_margin,
	unsupported_browser__introduction_text,
	unsupported_browser__why_support,
	unsupported_browser__why_support_copy,
	unsupported_browser__why_support_heading,
	unsupported_browser__why_support_subheading,
} from './unsupportedBrowserStyles';

export default function UnsupportedBrowser(): JSX.Element {
	return (
		<>
			<PageScaffold header={<Header />} footer={<Footer />}>
				<div css={container}>
					<section
						css={[
							gu_content_margin(5, 5),
							unsupported_browser__introduction_text,
						]}
					>
						<p>
							The browser you are using has known problems which may prevent
							some of this site's features from working as they should.
						</p>
						<p>
							Your financial support is vital to the Guardian's future, so if
							possible please update your browser and try again, or try an
							alternative such as Google's{' '}
							<a href="https://www.google.co.uk/chrome/browser">Chrome</a>.
						</p>
						<p>
							If you continue to have difficulty making a payment, our{' '}
							<a href="https://www.theguardian.com/info/tech-feedback">
								customer support team
							</a>{' '}
							are on hand to help.
						</p>
						<p>Thank you!</p>
					</section>
					<section css={unsupported_browser__why_support}>
						<div css={gu_content_margin(0, 0)}>
							<h1 css={unsupported_browser__why_support_heading}>
								Why do we need your support?
							</h1>
							<h2 css={unsupported_browser__why_support_subheading}>
								No one edits our editor
							</h2>
							<p css={unsupported_browser__why_support_copy}>
								Your support is vital in helping the Guardian do the most
								important journalism of all: that which takes time and effort.
								More people than ever now read and support the Guardian's
								independent, quality and investigative journalism.
							</p>
							<h2 css={unsupported_browser__why_support_subheading}>
								Advertising revenues are falling
							</h2>
							<p css={unsupported_browser__why_support_copy}>
								Like many media organisations, the Guardian is operating in an
								incredibly challenging commercial environment, and the
								advertising that we used to rely on to fund our work continues
								to fall.
							</p>
							<h2 css={unsupported_browser__why_support_subheading}>
								We haven't put up a paywall
							</h2>
							<p css={unsupported_browser__why_support_copy}>
								We want to keep our journalism as open as we can.
							</p>
						</div>
					</section>
				</div>
			</PageScaffold>
		</>
	);
}
