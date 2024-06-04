// based on the accordion row: https://github.com/guardian/source/blob/81a17eaae383b1fad9a622ebd8c8833e108fef82/packages/%40guardian/source-react-components/src/accordion/AccordionRow.tsx

import { css } from '@emotion/react';
import {
	from,
	palette,
	space,
	transitions,
} from '@guardian/source/foundations';
import { textInputThemeDefault } from '@guardian/source/react-components';
import { useEffect } from 'preact/hooks';
import { RadioWithImage } from './radioWithImage';

const radio = css`
	padding: ${space[2]}px ${space[3]}px;

	${from.mobileLandscape} {
		padding: ${space[2]}px ${space[4]}px;
	}

	/* Normalise the positioning of the radio button when we have supporting text */
	& > div {
		align-items: center;
		margin-bottom: 0;
	}
`;

const focused = css`
	box-shadow: inset 0 0 0 2px ${textInputThemeDefault.textInput.borderActive};
	margin-top: ${space[2]}px;
	border-radius: 4px;
`;

const notFocused = css`
	/* Using box shadows prevents layout shift when the rows are expanded */
	box-shadow: inset 0 0 0 1px ${textInputThemeDefault.textInput.border};
	margin-top: ${space[2]}px;
	border-radius: 4px;
`;

const borderBottom = css`
	background-image: linear-gradient(
		to top,
		${palette.brand[500]} 2px,
		transparent 2px
	);
`;

const accordionBodyPadding = css`
	padding: ${space[5]}px ${space[3]}px ${space[6]}px;
`;

const expandedBody = css`
	/*
	Hardcoded max-height to exceed existing max content height
	Otherwise, there will be a temporary scrollbar visible as 
	the row height transitions
	*/
	max-height: 1200px;
	transition: max-height ${transitions.medium};
	overflow: hidden;
	height: auto;
`;

const collapsedBody = css`
	max-height: 0;
	/*
	TODO:
	This transition is being ignored as the hidden
	attribute is applied immediately
	transition: max-height ${transitions.short};
	*/
	overflow: hidden;
`;

interface AvailablePaymentMethodAccordionRowProps {
	id: string;
	image: JSX.Element;
	label: string;
	name: string;
	checked: boolean;
	supportingText?: string;
	onChange: () => void;
	accordionBody?: () => JSX.Element;
	onRender: () => void;
	addQuantumMetricBlockListAttribute?: boolean;
}

export function AvailablePaymentMethodAccordionRow({
	id,
	image,
	label,
	name,
	checked,
	supportingText,
	accordionBody,
	onChange,
	onRender,
	addQuantumMetricBlockListAttribute,
}: AvailablePaymentMethodAccordionRowProps) {
	useEffect(onRender, []);

	const quantumMetricBlockListAttribute = addQuantumMetricBlockListAttribute
		? {
				'data-qm-masking': 'blocklist',
		  }
		: {};

	return (
		<div css={checked ? focused : notFocused}>
			<div
				{...quantumMetricBlockListAttribute}
				css={[...(checked && accordionBody ? [borderBottom] : [])]}
			>
				<RadioWithImage
					id={id}
					image={image}
					label={label}
					name={name}
					checked={checked}
					onChange={onChange}
					supportingText={supportingText}
					cssOverrides={[
						radio,
						...(checked && accordionBody ? [borderBottom] : []),
					]}
					isSupporterPlus={true}
				/>
			</div>

			<div
				css={[
					checked ? expandedBody : collapsedBody,
					...(checked && accordionBody ? [accordionBodyPadding] : []),
				]}
			>
				<div hidden={!checked}>{checked && accordionBody?.()}</div>
			</div>
		</div>
	);
}
