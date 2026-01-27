import { css } from '@emotion/react';
import {
	from,
	palette,
	space,
	textSans12,
	textSans17,
	until,
} from '@guardian/source/foundations';
import { Column, Columns, Container } from '@guardian/source/react-components';
import { FooterWithContents } from '@guardian/source-development-kitchen/react-components';
import type { SupportRegionId } from '@modules/internationalisation/countryGroup';
import { useParams } from 'react-router-dom';
import { Box, BoxContents } from 'components/checkoutBox/checkoutBox';
import { CheckoutHeading } from 'components/checkoutHeading/checkoutHeading';
import { Header } from 'components/headers/simpleHeader/simpleHeader';
import { PageScaffold } from 'components/page/pageScaffold';
import { guardianLiveTermsLink, privacyLink } from 'helpers/legal';
import * as cookie from 'helpers/storage/cookie';
import { getPageViewId } from 'helpers/tracking/trackingOphan';
import { isProd } from 'helpers/urls/url';

const darkBackgroundContainerMobile = css`
	background-color: ${palette.neutral[97]};
	${until.tablet} {
		background-color: ${palette.brand[400]};
	}
`;

const darkBackgroundContainerTablet = css`
	${from.tablet} {
		min-height: 400px;
	}
`;

const columns = css`
	position: relative;
	color: ${palette.neutral[7]};
	${textSans17};
	padding-top: ${space[10]}px;
	${until.tablet} {
		padding-top: ${space[3]}px;
	}
`;

const narrowBoxMarginAndPadding = css`
	border-radius: ${space[4]}px;
	:not(:last-child) {
		margin-bottom: ${space[4]}px;
	}

	// From tablet, slightly offset the spacing added by the Ticket Tailor widget itself.
	${from.tablet} {
		> div div div {
			margin: -8px;
		}
	}
`;

const tscs = css`
	color: #606060;
	${textSans12};
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

type Props = {
	supportRegionId: SupportRegionId;
};
export function Events({ supportRegionId }: Props) {
	const isTestUser = !!cookie.get('_test_username');
	const shouldUseCode = isTestUser || !isProd();
	const ticketTailorUrl = shouldUseCode
		? 'https://tickets-code.theguardian.live/events/guardianlivecode'
		: 'https://tickets.theguardian.live/events/guardianlive';

	const params = useParams();
	const eventId = params.eventId;
	const termsEvents = (
		<a href={guardianLiveTermsLink} target="_blank">
			Terms and Conditions
		</a>
	);
	const privacyPolicy = <a href={privacyLink}>Privacy Policy</a>;

	const pageviewId = getPageViewId();

	const hashUrlSearchParams = new URLSearchParams({
		'p[meta_page_view_id]': pageviewId,
		'p[meta_region_id]': supportRegionId,
	});
	const user = window.guardian.user;
	if (user) {
		hashUrlSearchParams.set('p[meta_identity_id]', user.id);
		user.firstName && hashUrlSearchParams.set('p[first_name]', user.firstName);
		user.lastName && hashUrlSearchParams.set('p[last_name]', user.lastName);
		user.email && hashUrlSearchParams.set('p[email]', user.email);
	}
	/** we decode this as that is what Ticket Tailor want */
	const presetDataUrl = `?preset_data=1&widget=true#${decodeURIComponent(
		hashUrlSearchParams.toString(),
	)}`;

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
			<CheckoutHeading
				withTopBorder={true}
				cssOverrides={darkBackgroundContainerTablet}
			></CheckoutHeading>
			<Container sideBorders cssOverrides={darkBackgroundContainerMobile}>
				<Columns cssOverrides={columns} collapseUntil="tablet">
					<Column span={[0, 2, 2, 3, 4]}></Column>
					<Column span={[1, 8, 8, 8, 8]}>
						<Box cssOverrides={narrowBoxMarginAndPadding}>
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
