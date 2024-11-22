import { css } from '@emotion/react';
import {
	from,
	headlineBold17,
	headlineBold20,
	headlineBold24,
	headlineBold34,
	palette,
	space,
	textSans17,
	textSans20,
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
		flex-direction: column;
		padding: ${space[5]}px 10px;
		${from.mobileLandscape} {
			padding-left: ${space[5]}px;
			padding-right: ${space[5]}px;
		}
		${from.tablet} {
			max-width: 740px;
		}
		${from.desktop} {
			max-width: 940px;
		}
	}
`;
const heading = css`
	color: ${palette.neutral[7]};
	text-align: left;
	${headlineBold24}
	margin-bottom: ${space[6]}px;
	${from.tablet} {
		text-align: center;
	}
	${from.desktop} {
		${headlineBold34}
	}
`;
const accordian = css`
	justify-content: space-between;
	border-bottom: 0px;
`;
const accordianRow = css`
	text-align: left;
	> button > * {
		${headlineBold17}
		${from.desktop} {
			${headlineBold20}
		}
	} // title
	> div > * {
		${textSans17}
		${from.desktop} {
			${textSans20}
		}
	} // body
	> button > div > span {
		display: none;
	} // toggle label
`;

const contents = [
	{
		title: 'What is included in my Guardian Light subscription?',
		body: 'tbc',
	},
	{
		title: 'Will my Guardian Light subscription work across all devices?',
		body: 'tbc',
	},
	{ title: 'How do I cancel my Guardian Light subscription?', body: 'tbc' },
	{ title: 'How do I contact customer services?', body: 'tbc' },
];

export function GuardianLightAccordian(): JSX.Element {
	return (
		<Container
			sideBorders
			borderColor={palette.neutral[100]}
			cssOverrides={container}
		>
			<h2 css={heading}>Any questions?</h2>
			<Accordion cssOverrides={accordian}>
				{contents.map((content) => (
					<AccordionRow
						label={content.title}
						hideToggleLabel={true}
						cssOverrides={accordianRow}
					>
						{content.body}
					</AccordionRow>
				))}
			</Accordion>
		</Container>
	);
}
