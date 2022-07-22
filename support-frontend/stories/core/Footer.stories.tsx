import React from 'react';
import CentredContainer from 'components/containers/centredContainer';
import FullWidthContainer from 'components/containers/fullWidthContainer';
import Footer from 'components/footerCompliant/Footer';
import { withVerticalCenterAlignment } from '../../.storybook/decorators/withCenterAlignment';

export default {
	title: 'Page/Page Footer',
	component: Footer,
	decorators: [
		(Story: React.FC): JSX.Element => (
			<FullWidthContainer theme="brand">
				<CentredContainer>
					<Story />
				</CentredContainer>
			</FullWidthContainer>
		),
	],
	withVerticalCenterAlignment,
};

export function PageFooter(args: { showContents: boolean }): JSX.Element {
	return (
		<Footer termsConditionsLink="https://www.theguardian.com/info/2014/aug/06/guardian-observer-digital-subscriptions-terms-conditions">
			{args.showContents && <>Terms and conditions may apply</>}
		</Footer>
	);
}

PageFooter.args = {
	showContents: true,
};
