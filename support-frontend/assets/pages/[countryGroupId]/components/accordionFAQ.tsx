import { Accordion, AccordionRow } from '@guardian/source/react-components';
import React, { useState } from 'react';
import { Container } from 'components/layout/container';
import {
	accordian,
	accordianRow,
	bodyContainer,
	container,
	heading,
} from './accordianFAQStyles';

export type FAQ = Array<{
	title: string;
	body: JSX.Element;
}>;

export type AccordionFAQProps = {
	faqItems?: FAQ;
};
export function AccordionFAQ({ faqItems }: AccordionFAQProps): JSX.Element {
	return (
		<Container sideBorders cssOverrides={container}>
			<div css={bodyContainer}>
				<h2 css={heading}>Any questions?</h2>
				{faqItems && (
					<Accordion cssOverrides={accordian}>
						{faqItems.map((faqRow) => (
							<AccordianFAQRow
								key={faqRow.title}
								title={faqRow.title}
								body={faqRow.body}
							/>
						))}
					</Accordion>
				)}
			</div>
		</Container>
	);
}

type AccordionFAQRowProps = {
	title: string;
	body: React.ReactNode;
};
function AccordianFAQRow({ title, body }: AccordionFAQRowProps): JSX.Element {
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
