import { css } from '@emotion/react';
import {
	from,
	headline,
	neutral,
	space,
	until,
} from '@guardian/source-foundations';
import { Column, Columns, Hide } from '@guardian/source-react-components';
import { Box, BoxContents } from 'components/checkoutBox/checkoutBox';
import { CheckoutHeading } from 'components/checkoutHeading/checkoutHeading';
import { Container } from 'components/layout/container';
import { PageScaffold } from 'components/page/pageScaffold';

const relativeContainer = css`
	position: relative;
	padding-bottom: ${space[24]}px;
	padding-top: ${space[3]}px;

	${from.desktop} {
		padding-top: ${space[6]}px;
	}
`;

const headingStyles = css`
	color: ${neutral[100]};
	display: inline-block;
	${headline.medium({ fontWeight: 'bold' })}
	font-size: 36px;
	${from.tablet} {
		font-size: 38px;
	}

	${until.desktop} {
		margin: 0 auto;
		margin-bottom: ${space[6]}px;
	}
	${from.desktop} {
		${headline.large({ fontWeight: 'bold' })}
		margin-bottom: ${space[3]}px;
	}
`;

const smallDemoBox = css`
	min-height: 200px;
`;

const largeDemoBox = css`
	min-height: 400px;
`;

export function SupporterPlusLandingPage(): JSX.Element {
	const heading = (
		<h1 css={headingStyles}>Thank you for&nbsp;your&nbsp;support</h1>
	);

	return (
		<PageScaffold id="supporter-plus-landing">
			<CheckoutHeading heading={heading}>
				<p>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque
					ex justo, varius ut porttitor tristique, rhoncus quis dolor.
				</p>
			</CheckoutHeading>
			<Container sideBorders>
				<Columns cssOverrides={relativeContainer} collapseUntil="tablet">
					<Column span={[0, 2, 5]}></Column>
					<Column span={[1, 8, 7]}>
						<Hide from="desktop">{heading}</Hide>
						<Box>
							<BoxContents>
								<p css={smallDemoBox}>Amount selection</p>
							</BoxContents>
						</Box>
						<Box>
							<BoxContents>
								<p css={largeDemoBox}>Personal details and payment</p>
							</BoxContents>
						</Box>
						<Box>
							<BoxContents>
								<p css={smallDemoBox}>Patrons message</p>
							</BoxContents>
						</Box>
					</Column>
				</Columns>
			</Container>
		</PageScaffold>
	);
}
