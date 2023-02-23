// ----- Imports ----- //
import { css, ThemeProvider } from '@emotion/react';
import { from, space } from '@guardian/source-foundations';
import {
	buttonThemeReaderRevenue,
	LinkButton,
	SvgArrowRightStraight,
} from '@guardian/source-react-components';
import Content, { Divider, NarrowContent } from 'components/content/content';
import type {
	DigitalPack,
	SubscriptionProduct,
} from 'helpers/productPrice/subscriptions';
import { sendTrackingEventsOnClick } from 'helpers/productPrice/subscriptions';

const buttonStyles = css`
	${from.desktop} {
		margin-left: ${space[2]}px;
	}
`;
type PropTypes = {
	subscriptionProduct: SubscriptionProduct | typeof DigitalPack;
};

// ----- Component ----- //
function ReturnSection(props: PropTypes): JSX.Element {
	return (
		<Content>
			<Divider />
			<NarrowContent>
				<div className="thank-you-stage__ctas">
					<ThemeProvider theme={buttonThemeReaderRevenue}>
						<LinkButton
							css={buttonStyles}
							priority="tertiary"
							aria-label="Return to the Guardian home page"
							href="https://theguardian.com"
							icon={<SvgArrowRightStraight />}
							iconSide="right"
							nudgeIcon
							onClick={sendTrackingEventsOnClick({
								id: 'checkout_return_home',
								product: props.subscriptionProduct,
								componentType: 'ACQUISITIONS_BUTTON',
							})}
						>
							Return to the Guardian
						</LinkButton>
					</ThemeProvider>
				</div>
			</NarrowContent>
		</Content>
	);
} // ----- Exports ----- //

export default ReturnSection;
