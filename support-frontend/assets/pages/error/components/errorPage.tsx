// ----- Imports ----- //
import { css } from '@emotion/react';
import { palette, space } from '@guardian/source/foundations';
import { themeButtonReaderRevenueBrand } from '@guardian/source/react-components';
import Rows from 'components/base/rows';
import AnchorButton from 'components/button/anchorButton';
import { themeButtonLegacyGray } from 'components/button/theme';
import Footer from 'components/footerCompliant/Footer';
import Header from 'components/headers/header/header';
import { PageScaffold } from 'components/page/pageScaffold';
import PageSection from 'components/pageSection/pageSection';
import Text, { LargeParagraph } from 'components/text/text';
import 'stylesheets/gu-sass/gu-sass.scss';
import 'stylesheets/skeleton/fonts.scss';
import 'stylesheets/skeleton/reset-src.scss';
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

const mainContentStyles = css`
	background-color: ${palette.neutral[93]};
	@supports (display: flex) {
		flex: 1 0 auto;
	}
`;

const paddingOverrides = css`
	padding-top: ${gu_v_spacing * 2}px;
	padding-bottom: ${gu_v_spacing * 3}px;
`;

const buttonRow = css`
	display: flex;
	flex-direction: column;
	gap: ${space[3]}px;
`;

export default function ErrorPage(props: ErrorPageProps): JSX.Element {
	return (
		<PageScaffold
			header={<Header countryGroupId={countryGroupId} />}
			footer={<Footer />}
		>
			<div css={mainContentStyles}>
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
							<div css={buttonRow}>
								{props.supportLink && (
									<AnchorButton
										aria-label="click here to support the Guardian"
										link="/"
										ctaButtonText="Support the Guardian"
										theme={themeButtonReaderRevenueBrand}
										size="small"
									/>
								)}
								<AnchorButton
									aria-label="click here to return to the Guardian home page"
									link="https://www.theguardian.com"
									priority="tertiary"
									theme={themeButtonLegacyGray}
									ctaButtonText="Go to the Guardian home page"
									size="small"
								/>
							</div>
						</Rows>
					</Text>
				</PageSection>
			</div>
		</PageScaffold>
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
