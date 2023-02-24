// based on the accordion row: https://github.com/guardian/source/blob/81a17eaae383b1fad9a622ebd8c8833e108fef82/packages/%40guardian/source-react-components/src/accordion/AccordionRow.tsx

import { css } from '@emotion/react';
import type { EmotionJSX } from '@emotion/react/types/jsx-namespace';
import {
	brand,
	from,
	neutral,
	space,
	transitions,
} from '@guardian/source-foundations';
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
	border: 2px solid ${brand[500]};
	margin-top: ${space[2]}px;
	border-radius: 4px;
`;

const notFocused = css`
	border: 2px solid ${neutral[46]};
	margin-top: ${space[2]}px;
	border-radius: 4px;
`;

const borderBottom = css`
	background-image: linear-gradient(to top, ${brand[500]} 2px, transparent 2px);
`;

const accordionBodyPadding = css`
	padding: ${space[5]}px ${space[3]}px ${space[6]}px;
`;

const expandedBody = css`
	/*
	TODO:
	Hardcoded max-height because auto is invalid.
	If content is longer, we'll need to set overflow: auto
	but only after max-height has been reached.
	Otherwise, for short content we'll always see a flash
	of a scrollbar as the row height is transitioning
	*/
	max-height: 500px;
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
}: AvailablePaymentMethodAccordionRowProps): EmotionJSX.Element {
	useEffect(onRender, []);

	return (
		<div css={checked ? focused : notFocused}>
			<div css={[...(checked && accordionBody ? [borderBottom] : [])]}>
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
