import { css } from '@emotion/react';
import {
	from,
	headlineBold24,
	headlineBold34,
	palette,
	space,
} from '@guardian/source/foundations';
import {
	Accordion,
	AccordionRow,
	Container,
} from '@guardian/source/react-components';

const container = css`
	background-color: ${palette.neutral[100]};
	> div {
		display: flex;
		justify-content: center;
		padding: ${space[5]}px 12px;
	}
`;
const innerContainer = css`
	max-width: 940px;
	text-align: center;
`;
const heading = css`
	text-align: center;
	color: ${palette.neutral[7]};
	${headlineBold24}
	margin-bottom: ${space[6]}px;
	${from.desktop} {
		${headlineBold34}
	}
`;
const accordian = css`
	${from.desktop} {
		width: 940px;
	}
`;

export function GuardianLightAccordian(): JSX.Element {
	return (
		<Container
			sideBorders
			borderColor={palette.neutral[100]}
			cssOverrides={container}
		>
			<div css={innerContainer}>
				<h2 css={heading}>Any questions?</h2>
				<div css={accordian}>
					<Accordion>
						<AccordionRow label="What is included in my Guardian Light subscription?">
							test
						</AccordionRow>
						<AccordionRow label="Will my Guardian Light subscription work across all devices?">
							test
						</AccordionRow>
						<AccordionRow label="How do I cancel my Guardian Light subscription?">
							test
						</AccordionRow>
						<AccordionRow label="How do I contact customer services?">
							test
						</AccordionRow>
					</Accordion>
				</div>
			</div>
		</Container>
	);
}
