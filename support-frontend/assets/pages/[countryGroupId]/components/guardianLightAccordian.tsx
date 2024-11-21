import { css } from '@emotion/react';
import { palette, space } from '@guardian/source/foundations';
import {
	Accordion,
	AccordionRow,
	Container,
} from '@guardian/source/react-components';

const container = css`
	display: flex;
	background-color: ${palette.neutral[100]};
	> div {
		padding: ${space[5]}px 72px;
	}
`;
const innerContainer = css`
	max-width: 940px;
	text-align: center;
`;

export function GuardianLightAccordian(): JSX.Element {
	return (
		<Container
			sideBorders
			borderColor={palette.neutral[100]}
			cssOverrides={container}
		>
			<div css={innerContainer}>
				<Accordion>
					<AccordionRow label="Collecting from multiple newsagents">
						Present your card to a newsagent each time you collect the paper.
						The newsagent will scan your card and will be reimbursed for each
						transaction automatically.
					</AccordionRow>
					<AccordionRow label="Delivery from your retailer">
						Simply give your preferred store / retailer the barcode printed on
						your subscription letter.
					</AccordionRow>
				</Accordion>
			</div>
		</Container>
	);
}
