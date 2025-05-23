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
import { useState } from 'react';
import { Container } from 'components/layout/container';
import { guardianAdLiteTermsLink } from 'helpers/legal';
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
const accordianRow = (expanded: boolean) => css`
	border-top: 1px solid ${palette.neutral[73]};
	text-align: left;
	> button {
		align-items: flex-start;
		padding: ${space[1]}px 0px ${expanded ? 0 : space[6]}px;
		${from.desktop} {
			padding: ${space[2]}px 0px ${expanded ? 0 : space[8]}px;
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
		padding-bottom: ${expanded ? space[1] : 0}px;
		${from.desktop} {
			padding-bottom: ${expanded ? space[3] : 0}px;
			${article17}
		}
	} // body
	> button > div > span {
		display: none;
	} // remove label
`;
const rowSpacing = css`
	padding-top: ${space[2]}px;
	${from.desktop} {
		max-width: 648px;
	}
`;

const rows = [
	{
		title: 'What is included in my Guardian Ad-Lite subscription?',
		body: (
			<div>
				<p css={rowSpacing}>
					A Guardian Ad-Lite subscription enables you to read the Guardian
					website without personalised advertising. You will still see
					advertising but it will be delivered without the use of personalised
					advertising cookies or similar technologies.
				</p>
				<p css={rowSpacing}>
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
			<div css={rowSpacing}>
				You can read the Guardian website without personalised advertising
				across all devices by logging into your Guardian account. Guardian
				Ad-Lite applies to our website only, and not the Guardian Live App.
			</div>
		),
	},
	{
		title: 'How do I cancel my Guardian Ad-Lite subscription?',
		body: (
			<div css={rowSpacing}>
				To cancel, go to Manage my account, and for further information on your
				Guardian Ad-Lite subscription, see{' '}
				<a href={guardianAdLiteTermsLink}>here</a>.
			</div>
		),
	},
	{
		title: 'How do I contact customer services?',
		body: (
			<div css={rowSpacing}>
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
					{rows.map((row) => (
						<AccordianComponentRow title={row.title} body={row.body} />
					))}
				</Accordion>
			</div>
		</Container>
	);
}

type AccordianRowProps = {
	title: string;
	body: React.ReactNode;
};

function AccordianComponentRow({
	title,
	body,
}: AccordianRowProps): JSX.Element {
	const [expanded, setExpanded] = useState<boolean>(false);
	return (
		<AccordionRow
			label={title}
			hideToggleLabel={true}
			cssOverrides={accordianRow(expanded)}
			onClick={() => setExpanded(!expanded)}
		>
			{body}
		</AccordionRow>
	);
}
