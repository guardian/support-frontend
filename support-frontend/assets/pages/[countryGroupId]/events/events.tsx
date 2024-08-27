import { css } from '@emotion/react';
import { palette, space, textSans, until } from '@guardian/source/foundations';
import { Column, Columns, Container } from '@guardian/source/react-components';
import { FooterWithContents } from '@guardian/source-development-kitchen/react-components';
import { useParams } from 'react-router-dom';
import { Box, BoxContents } from 'components/checkoutBox/checkoutBox';
import { CheckoutHeading } from 'components/checkoutHeading/checkoutHeading';
import { Header } from 'components/headers/simpleHeader/simpleHeader';
import { PageScaffold } from 'components/page/pageScaffold';
import { guardianLiveTermsLink, privacyLink } from 'helpers/legal';
import * as cookie from 'helpers/storage/cookie';
import { getPageViewId } from 'helpers/tracking/ophan';
import { isProd } from 'helpers/urls/url';

const darkBackgroundContainerMobile = css`
	background-color: ${palette.neutral[97]};
	${until.tablet} {
		background-color: ${palette.brand[400]};
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
		margin-bottom: ${space[4]}px;
	}
`;

const tscs = css`
	color: #606060;
	${textSans.xxsmall()};
	padding-bottom: ${space[14]}px;
	${until.tablet} {
		padding-bottom: ${space[2]}px;
		color: ${palette.neutral[97]};
	}
	& a {
		color: #606060;
		${until.tablet} {
			color: ${palette.neutral[97]};
		}
	}
`;

const footerWiden = css`
	margin-top: ${space[8]}px;
`;

export function Events() {
	const isTestUser = !!cookie.get('_test_username');
	const shouldUseCode = isTestUser || !isProd();
	const ticketTailorUrl = shouldUseCode
		? 'https://www.tickettailor.com/events/guardianlivecode'
		: 'https://tickets.theguardian.live/events/guardianlive';

	const params = useParams();
	const eventId = params.eventId;
	const termsEvents = <a href={guardianLiveTermsLink}>Terms and Conditions</a>;
	const privacyPolicy = <a href={privacyLink}>Privacy Policy</a>;

	const urlSearchParams = new URLSearchParams(window.location.search);
	const presetData = urlSearchParams.get('presetData') === '1';
	let presetDataUrl = '';
	if (presetData) {
		const pageviewId = getPageViewId();
		const hashUrlSearchParams = new URLSearchParams({
			'p[meta_page_view_id]': pageviewId,
		});
		const user = window.guardian.user;
		if (user) {
			hashUrlSearchParams.set('p[meta_identity_id]', user.id);
			user.firstName &&
				hashUrlSearchParams.set('p[first_name]', user.firstName);
			user.lastName && hashUrlSearchParams.set('p[last_name]', user.lastName);
			user.email && hashUrlSearchParams.set('p[email]', user.email);
		}
		/** we decode this as that is what Ticket Tailor want */
		presetDataUrl = `?preset_data=1&widget=true#${decodeURIComponent(
			hashUrlSearchParams.toString(),
		)}`;
	}

	const embedUrl = `${ticketTailorUrl}/${eventId}/book${presetDataUrl}`;

	return (
		<PageScaffold
			header={<Header />}
			footer={
				<FooterWithContents>
					<span css={footerWiden}></span>
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
												href={`${ticketTailorUrl}/${eventId}/book`}
												target="_blank"
											>
												Click here to buy tickets
											</a>
										</p>
									</div>
									<script
										src="https://cdn.tickettailor.com/js/widgets/min/widget.js"
										data-url={`${embedUrl}`}
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
