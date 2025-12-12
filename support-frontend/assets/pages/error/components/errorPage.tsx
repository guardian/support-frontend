// ----- Imports ----- //
import { css } from '@emotion/react';
import Rows from 'components/base/rows';
import AnchorButton from 'components/button/anchorButton';
import Footer from 'components/footerCompliant/Footer';
import Header from 'components/headers/header/header';
import Page from 'components/page/page';
import PageSection from 'components/pageSection/pageSection';
import Text, { LargeParagraph } from 'components/text/text';
import '../error.scss';
import { CountryGroup } from 'helpers/internationalisation/classes/countryGroup';
import { contributionsEmail } from 'helpers/legal';
import { gu_v_spacing } from 'stylesheets/emotion/layout';
import SquaresIntroduction from './introduction/squaresIntroduction';

// ----- Types ----- //
export type ErrorPageProps = {
	errorCode?: string;
	headings: string[];
	copy: string;
	reportLink?: boolean;
	supportLink?: boolean;
};

const countryGroupId = CountryGroup.detect();

const paddingOverrides = css`
	padding-top: ${gu_v_spacing * 2}px;
	padding-bottom: ${gu_v_spacing * 3}px;
`;

export default function ErrorPage(props: ErrorPageProps): JSX.Element {
	return (
		<Page
			header={<Header countryGroupId={countryGroupId} />}
			footer={<Footer />}
		>
			<SquaresIntroduction
				headings={props.headings}
				errorCode={props.errorCode}
			/>
			<PageSection cssOverrides={paddingOverrides}>
				<Text>
					<LargeParagraph>
						<span className="error-copy__text">{props.copy} </span>
						<ReportLink show={props.reportLink ?? false} />
					</LargeParagraph>
					<Rows>
						{props.supportLink && (
							<AnchorButton
								aria-label="click here to support the Guardian"
								href="/"
								modifierClasses={['support-the-guardian']}
							>
								Support the Guardian
							</AnchorButton>
						)}
						<br />
						<AnchorButton
							aria-label="click here to return to the Guardian home page"
							href="https://www.theguardian.com"
							appearance="greyHollow"
						>
							Go to the Guardian home page
						</AnchorButton>
					</Rows>
				</Text>
			</PageSection>
		</Page>
	);
} // ----- Auxiliary Components ----- //

function ReportLink(props: { show: boolean }) {
	if (props.show) {
		return (
			<span className="error-copy__text">
				please{' '}
				<a className="error-copy__link" href={contributionsEmail.GBPCountries}>
					report it
				</a>
				.
			</span>
		);
	}

	return null;
}

// ----- Default Props ----- //
ErrorPage.defaultProps = {
	reportLink: false,
	supportLink: true,
	errorCode: null,
};
