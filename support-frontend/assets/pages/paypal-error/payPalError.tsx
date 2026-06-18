import { LinkButton } from '@guardian/source/react-components';
import Footer from 'components/footerCompliant/Footer';
import Header from 'components/headers/header/header';
import { PageScaffold } from 'components/page/pageScaffold';
import PageSection from 'components/pageSection/pageSection';
import QuestionsContact from 'components/questionsContact/questionsContact';
import { CountryGroup } from 'helpers/internationalisation/classes/countryGroup';
import { setUpTrackingAndConsents } from 'helpers/page/page';
import { renderPage } from 'helpers/rendering/render';
import {
	mainContentStyles,
	pageSectionBodyOverrides,
	payPalErrorCopy,
	payPalErrorHeader,
} from './payPalErrorStyles';

// ----- Page Startup ----- //
setUpTrackingAndConsents({});
// ----- Render ----- //

export const PayPalError = (
	<PageScaffold
		header={<Header countryGroupId={CountryGroup.detect()} />}
		footer={<Footer />}
	>
		<div css={mainContentStyles}>
			<PageSection cssOverrides={pageSectionBodyOverrides}>
				<h1 css={payPalErrorHeader}>Please try again</h1>
				<p css={payPalErrorCopy}>
					Sorry, we were unable to complete your payment the first time. Don’t
					worry, you haven’t been charged anything.
				</p>
				<LinkButton href="/contribute">Try again</LinkButton>
			</PageSection>
			<QuestionsContact />
		</div>
	</PageScaffold>
);
renderPage(PayPalError);
