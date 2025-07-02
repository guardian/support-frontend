import { Accordion, AccordionRow } from '@guardian/source/react-components';
import { useState } from 'react';
import { Container } from 'components/layout/container';
import {
	accordian,
	accordianRow,
	bodyContainer,
	container,
	heading,
} from './accordianFAQStyles';

export type FAQItem = {
	title: string;
	body: JSX.Element;
};

export type AccordionFAQProps = {
	faqItems: FAQItem[];
};
export function AccordionFAQ({ faqItems }: AccordionFAQProps): JSX.Element {
	return (
		<Container sideBorders cssOverrides={container}>
			<div css={bodyContainer}>
				<h2 css={heading}>Any questions?</h2>
				<Accordion cssOverrides={accordian}>
					{faqItems.map((faqRow) => (
						<AccordianFAQRow
							key={faqRow.title}
							title={faqRow.title}
							body={faqRow.body}
						/>
					))}
				</Accordion>
			</div>
		</Container>
	);
}

function AccordianFAQRow({ title, body }: FAQItem): JSX.Element {
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
