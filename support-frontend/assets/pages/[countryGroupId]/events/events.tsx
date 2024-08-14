import { css } from '@emotion/react';
import {
	from,
	palette,
	space,
	textSans,
	until,
} from '@guardian/source/foundations';
import { Column, Columns, Container } from '@guardian/source/react-components';
import { FooterWithContents } from '@guardian/source-development-kitchen/react-components';
import { useParams } from 'react-router-dom';
import { Box, BoxContents } from 'components/checkoutBox/checkoutBox';
import { CheckoutHeading } from 'components/checkoutHeading/checkoutHeading';
import { Header } from 'components/headers/simpleHeader/simpleHeader';
import { PageScaffold } from 'components/page/pageScaffold';
import { guardianLiveTermsLink, privacyLink } from 'helpers/legal';
import * as cookie from 'helpers/storage/cookie';
import { isProd } from 'helpers/urls/url';
import ThankYouFooter from 'pages/supporter-plus-thank-you/components/thankYouFooter';

const darkBackgroundContainerMobile = css`
	background-color: ${palette.neutral[97]};

	${until.tablet} {
		/* background-color: ${palette.brand[400]}; */
		border-bottom: 1px solid ${palette.brand[600]};
	}

	div {
		display: flex;
		flex-direction: column;
	}
`;

const columns = css`
	position: relative;
	color: ${palette.neutral[7]};
	${textSans.medium()};
	padding-top: ${space[10]}px;
	${until.tablet} {
		padding-top: ${space[3]}px;
	}
`;

const shorterBoxMargin = css`
	border-radius: ${space[2]}px;
	:not(:last-child) {
		${until.tablet} {
			margin-bottom: ${space[2]}px;
		}
	}
`;

const tscs = css`
	color: #606060;
	${textSans.xxsmall()};
	padding-bottom: ${space[2]}px;
	${until.tablet} {
		color: ${palette.neutral[97]};
	}
	& a {
		color: #606060;
		${until.tablet} {
			color: ${palette.neutral[97]};
		}
	}
`;

const iframe = css`
	flex: 1 1 calc(100vh - 216px);

	${from.tablet} {
		flex: 1 1 calc(100vh - 171px);
	}

	${from.desktop} {
		flex: 1 1 calc(100vh - 210px);
	}
`;

export function Events() {
	const isTestUser = !!cookie.get('_test_username');
	const shouldUseCode = isTestUser || !isProd();
	const ticketTailorUrl = shouldUseCode
		? 'https://www.tickettailor.com/events/guardianlivecode'
		: 'https://tickets.theguardian.live/events/guardianlive';

	const urlSearchParams = new URLSearchParams(window.location.search);
	const showDetails = urlSearchParams.get('showDetails') === 'true';

	const params = useParams();
	const eventId = params.eventId;
	const termsEvents = <a href={guardianLiveTermsLink}>Terms and Conditions</a>;
	const privacyPolicy = <a href={privacyLink}>Privacy Policy</a>;

	return (
		<PageScaffold
			header={<Header />}
			footer={
				<FooterWithContents>
					<ThankYouFooter />
				</FooterWithContents>
			}
		>
			<Container sideBorders cssOverrides={darkBackgroundContainerMobile}>
				{showDetails && (
					<iframe
						css={iframe}
						// src={`${ticketTailorUrl}/${eventId}`}
						src="https://tickets.theguardian.live/events/guardianlive/1344365"
						title="Event page"
						sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
					></iframe>
				)}
				{!showDetails && (
					<>
						<CheckoutHeading withTopBorder={true}></CheckoutHeading>
						<Columns cssOverrides={columns} collapseUntil="tablet">
							<Column span={[0, 2, 2, 2, 2]}></Column>
							<Column span={[1, 12, 12, 12, 12]}>
								<Box cssOverrides={shorterBoxMargin}>
									<BoxContents
										cssOverrides={css`
											display: flex;
											flex-direction: column;
											flex: 1 1 0%;
										`}
									>
										<div className="tt-widget">
											<div className="tt-widget-fallback">
												<p>
													<a
														href={`${ticketTailorUrl}/${eventId}/book`}
														target="_blank"
													>
														Click here to buy tickets
													</a>
												</p>
											</div>
											<script
												src="https://cdn.tickettailor.com/js/widgets/min/widget.js"
												data-url={`${ticketTailorUrl}/${eventId}/book`}
												data-type="inline"
												data-inline-minimal="true"
												data-inline-show-logo="false"
												data-inline-bg-fill="false"
												data-inline-inherit-ref-from-url-param=""
												data-inline-ref="support-theguardian-com"
											></script>
										</div>
									</BoxContents>
								</Box>
								<div css={tscs}>
									<p>
										By proceeding, you agree to the Guardian Live events{' '}
										{termsEvents}.
									</p>
									<p>
										To find out what personal data we collect and how we use it,
										please visit our {privacyPolicy}.
									</p>
								</div>
							</Column>
						</Columns>
					</>
				)}
			</Container>
		</PageScaffold>
	);
}
