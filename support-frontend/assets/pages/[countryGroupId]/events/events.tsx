import { css } from '@emotion/react';
import { palette, space, textSans, until } from '@guardian/source/foundations';
import { Column, Columns, Container } from '@guardian/source/react-components';
import { FooterWithContents } from '@guardian/source-development-kitchen/react-components';
import { Box, BoxContents } from 'components/checkoutBox/checkoutBox';
import { CheckoutHeading } from 'components/checkoutHeading/checkoutHeading';
import { Header } from 'components/headers/simpleHeader/simpleHeader';
import { PageScaffold } from 'components/page/pageScaffold';
import { guardianLiveTermsLink, privacyLink } from 'helpers/legal';
import ThankYouFooter from 'pages/supporter-plus-thank-you/components/thankYouFooter';

const darkBackgroundContainerMobile = css`
	background-color: ${palette.neutral[97]};
	${until.tablet} {
		background-color: ${palette.brand[400]};
		border-bottom: 1px solid ${palette.brand[600]};
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

export function Events() {
	const searchParams = new URLSearchParams(window.location.search);
	const eventId = searchParams.get('eventId') ?? '4180362';
	const chk = searchParams.get('chk') ?? '9fa2';

	const termsEvents = <a href={guardianLiveTermsLink}>Terms and Conditions</a>;
	const privacyPolicy = <a href={privacyLink}>Privacy Policy</a>;

	return (
		<PageScaffold
			header={<Header />}
			footer={
				<FooterWithContents>
					<ThankYouFooter copyOverride="&nbsp;" />
				</FooterWithContents>
			}
		>
			<CheckoutHeading withTopBorder={true}></CheckoutHeading>
			<Container sideBorders cssOverrides={darkBackgroundContainerMobile}>
				<Columns cssOverrides={columns} collapseUntil="tablet">
					<Column span={[0, 2, 2, 3, 4]}></Column>
					<Column span={[1, 8, 8, 8, 8]}>
						<Box cssOverrides={shorterBoxMargin}>
							<BoxContents>
								<div className="tt-widget">
									<div className="tt-widget-fallback">
										<p>
											<a
												href={`https://tickets.theguardian.live/checkout/new-session/id/${eventId}/chk/${chk}/?ref=support-theguardian-com`}
												target="_blank"
											>
												Click here to buy tickets
											</a>
										</p>
									</div>
									<script
										src="https://cdn.tickettailor.com/js/widgets/min/widget.js"
										data-url={`https://tickets.theguardian.live/checkout/new-session/id/${eventId}/chk/${chk}/?ref=support-theguardian-com`}
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
			</Container>
		</PageScaffold>
	);
}
