// based on the accordion row: https://github.com/guardian/source/blob/81a17eaae383b1fad9a622ebd8c8833e108fef82/packages/%40guardian/source-react-components/src/accordion/AccordionRow.tsx

import { css } from '@emotion/react';
import type { EmotionJSX } from '@emotion/react/types/jsx-namespace';
import {
	brand,
	neutral,
	space,
	transitions,
} from '@guardian/source-foundations';
import {
	SvgCreditCard,
	SvgDirectDebit,
} from '@guardian/source-react-components';
import type { RecentlySignedInExistingPaymentMethod } from 'helpers/forms/existingPaymentMethods/existingPaymentMethods';
import {
	getExistingPaymentMethodLabel,
	mapExistingPaymentMethodToPaymentMethod,
	subscriptionsToExplainerList,
	subscriptionToExplainerPart,
} from 'helpers/forms/existingPaymentMethods/existingPaymentMethods';
import type { PaymentMethod } from 'helpers/forms/paymentMethods';
import { RadioWithImage } from './radioWithImage';

const radio = css`
	padding: ${space[2]}px ${space[4]}px;
`;

const existingPaymentMethodOverrides = css`
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
	border: 2px solid ${neutral[60]};
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

interface ExistingPaymentMethodAccordionRowProps {
	expanded: boolean;
	preExistingPaymentMethod: RecentlySignedInExistingPaymentMethod;
	onChange: () => void;
	paymentMethod: PaymentMethod | null;
	existingPaymentMethod: RecentlySignedInExistingPaymentMethod | undefined;
	accordionBody?: JSX.Element;
	checked: boolean;
}

export function ExistingPaymentMethodAccordionRow({
	paymentMethod,
	preExistingPaymentMethod,
	existingPaymentMethod,
	onChange,
	expanded,
	accordionBody,
	checked,
}: ExistingPaymentMethodAccordionRowProps): EmotionJSX.Element {
	const image =
		preExistingPaymentMethod.paymentType === 'Card' ? (
			<SvgCreditCard />
		) : (
			<SvgDirectDebit />
		);

	return (
		<div css={checked ? focused : notFocused}>
			<div css={[...(checked && accordionBody ? [borderBottom] : [])]}>
				<RadioWithImage
					id={`paymentMethod-existing${preExistingPaymentMethod.billingAccountId}`}
					name="paymentMethod"
					onChange={onChange}
					checked={
						paymentMethod ===
							mapExistingPaymentMethodToPaymentMethod(
								preExistingPaymentMethod,
							) && existingPaymentMethod === preExistingPaymentMethod
					}
					cssOverrides={[
						radio,
						...(checked && accordionBody ? [borderBottom] : []),
						existingPaymentMethodOverrides,
					]}
					isSupporterPlus={true}
					image={image}
					label={getExistingPaymentMethodLabel(preExistingPaymentMethod)}
					supportingText={`Used for your ${subscriptionsToExplainerList(
						preExistingPaymentMethod.subscriptions.map(
							subscriptionToExplainerPart,
						),
					)}`}
				/>
			</div>

			{/* Accordion Body */}
			<div
				css={[
					expanded ? expandedBody : collapsedBody,
					...(expanded && accordionBody ? [accordionBodyPadding] : []),
				]}
			>
				<div hidden={!expanded}>{accordionBody}</div>
			</div>
		</div>
	);
}

interface AvailablePaymentMethodAccordionRowProps {
	id: string;
	image: JSX.Element;
	label: string;
	name: string;
	checked: boolean;
	onChange: () => void;
	accordionBody?: JSX.Element;
}

export function AvailablePaymentMethodAccordionRow({
	id,
	image,
	label,
	name,
	checked,
	accordionBody,
	onChange,
}: AvailablePaymentMethodAccordionRowProps): EmotionJSX.Element {
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
				<div hidden={!checked}>{accordionBody}</div>
			</div>
		</div>
	);
}
