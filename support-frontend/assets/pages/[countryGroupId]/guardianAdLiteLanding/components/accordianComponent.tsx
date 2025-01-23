import { css } from '@emotion/react';
import {
	article15,
	article17,
	from,
	headlineBold17,
	headlineBold20,
	headlineBold28,
	headlineBold34,
	palette,
	space,
} from '@guardian/source/foundations';
import { Accordion, AccordionRow } from '@guardian/source/react-components';
import { Container } from 'components/layout/container';
import { helpCentreUrl } from 'helpers/urls/externalLinks';

const container = css`
	background-color: ${palette.neutral[97]};
	> div {
		padding: ${space[3]}px 10px ${space[14]}px;
		${from.mobileLandscape} {
			padding-left: ${space[5]}px;
			padding-right: ${space[5]}px;
		}
		${from.tablet} {
			padding-top: ${space[9]}px;
			padding-bottom: ${space[24]}px;
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
	padding: ${space[3]}px;
	${from.tablet} {
		padding: ${space[5]}px ${space[6]}px ${space[1]}px;
	}
	${from.desktop} {
		max-width: 940px;
	}
`;
const heading = css`
	text-align: left;
	${headlineBold28}
	margin-bottom: ${space[6]}px;
	${from.desktop} {
		${headlineBold34}
		margin-bottom: ${space[9]}px;
	}
`;
const accordian = css`
	justify-content: space-between;
	border-bottom: 0px;
	& a {
		color: ${palette.brand[500]};
	}
`;
const accordianRow = css`
	border-top: 1px solid ${palette.neutral[73]};
	text-align: left;
	> button {
		padding: ${space[1]}px 0px ${space[6]}px;
		${from.desktop} {
			padding: ${space[2]}px 0px ${space[8]}px;
		}
	} // title
	> button > * {
		margin-right: ${space[1]}px;
		${headlineBold17}
		${from.desktop} {
			${headlineBold20}
		}
	} // title (content)
	> div > * {
		${article15}
		${from.desktop} {
			${article17}
		}
	} // body
	> button > div > span {
		display: none;
	} // toggle label
`;

const contents = [
	{
		title: 'What is included in my Guardian Ad-Lite subscription?',
		body: (
			<div>
				<p>
					A Guardian Ad-Lite subscription enables you to read the Guardian
					website without personalised advertising. You will still see
					advertising but it will be delivered without the use of personalised
					advertising cookies or similar technologies.
				</p>
				<p>
					A Guardian Ad-Lite subscription does not entitle you to the additional
					benefits on offer via our All-access digital and Digital + print
					subscriptions, which are stated <a href="/contribute">here</a>.
				</p>
			</div>
		),
	},
	{
		title: 'Will my Guardian Ad-Lite subscription work across all devices?',
		body: (
			<div>
				You can read the Guardian website without personalised advertising
				across all devices by logging into your Guardian account.
			</div>
		),
	},
	{
		title: 'How do I cancel my Guardian Ad-Lite subscription?',
		body: (
			<div>
				To cancel, go to Manage my account, and for further information on your
				Guardian Ad-Lite subscription, see <a href="/contribute">here</a>.
			</div>
		),
	},
	{
		title: 'How do I contact customer services?',
		body: (
			<div>
				For any queries, including subscription-related queries, please visit
				our <a href={helpCentreUrl}>Help centre</a>, where you will also find
				contact details for your region.
			</div>
		),
	},
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
