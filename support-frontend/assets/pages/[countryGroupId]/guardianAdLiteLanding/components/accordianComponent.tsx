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
import { Accordion, AccordionRow } from '@guardian/source/react-components';
import { Container } from 'components/layout/container';

const container = css`
	background-color: ${palette.neutral[97]};
	> div {
		padding: ${space[3]}px 10px ${space[12]}px;
		${from.mobileLandscape} {
			padding-left: ${space[5]}px;
			padding-right: ${space[5]}px;
		}
		${from.tablet} {
			padding-top: ${space[9]}px;
			display: flex;
			justify-content: center;
		}
	}
`;
const bodyContainer = css`
	width: 100%;
	color: ${palette.neutral[7]};
	background-color: ${palette.neutral[100]};
	border-radius: ${space[3]}px;
	padding: ${space[4]}px ${space[3]}px ${space[6]}px;
	${from.tablet} {
		padding: ${space[5]}px ${space[6]}px 28px;
	}
	${from.desktop} {
		max-width: 940px;
	}
`;
const heading = css`
	text-align: left;
	${headlineBold24}
	margin-bottom: ${space[6]}px;
	${from.desktop} {
		${headlineBold34}
	}
`;
const accordian = css`
	justify-content: space-between;
	border-bottom: 0px;
`;
const accordianRow = css`
	border-top: 1px solid ${palette.neutral[73]};
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
		title: 'What is included in my Guardian Ad-Lite subscription?',
		body: 'tbc',
	},
	{
		title: 'Will my Guardian Ad-Lite subscription work across all devices?',
		body: 'tbc',
	},
	{ title: 'How do I cancel my Guardian Ad-Lite subscription?', body: 'tbc' },
	{ title: 'How do I contact customer services?', body: 'tbc' },
];

export function AccordianComponent(): JSX.Element {
	return (
		<Container sideBorders cssOverrides={container}>
			<div css={bodyContainer}>
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
			</div>
		</Container>
	);
}
