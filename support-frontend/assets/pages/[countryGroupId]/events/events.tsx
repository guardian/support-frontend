import { css } from '@emotion/react';
import { from, sport } from '@guardian/source/foundations';
import { Container } from '@guardian/source/react-components';
import { FooterWithContents } from '@guardian/source-development-kitchen/react-components';
import { Header } from 'components/headers/simpleHeader/simpleHeader';
import { PageScaffold } from 'components/page/pageScaffold';
import ThankYouFooter from 'pages/supporter-plus-thank-you/components/thankYouFooter';

const checkoutContainer = css`
	${from.tablet} {
		background-color: ${sport[800]};
	}
`;

export function Events() {
	const searchParams = new URLSearchParams(window.location.search);
	const eventId = searchParams.get('eventId') ?? '4180362';
	return (
		<PageScaffold
			header={<Header />}
			footer={
				<FooterWithContents>
					<ThankYouFooter />
				</FooterWithContents>
			}
		>
			<div css={checkoutContainer}>
				<Container>
					<div className="tt-widget">
						<div className="tt-widget-fallback">
							<p>
								<a
									href={`https://tickets.theguardian.live/checkout/new-session/id/${eventId}/chk/9fa2/?ref=support-theguardian-com`}
									target="_blank"
								>
									Click here to buy tickets
								</a>
							</p>
						</div>
						<script
							src="https://cdn.tickettailor.com/js/widgets/min/widget.js"
							data-url={`https://tickets.theguardian.live/checkout/new-session/id/${eventId}/chk/9fa2/?ref=support-theguardian-com`}
							data-type="inline"
							data-inline-minimal="true"
							data-inline-show-logo="false"
							data-inline-bg-fill="false"
							data-inline-inherit-ref-from-url-param=""
							data-inline-ref="support-theguardian-com"
						></script>
					</div>
				</Container>
			</div>
		</PageScaffold>
	);
}
