// based on the accordion row: https://github.com/guardian/source/blob/81a17eaae383b1fad9a622ebd8c8833e108fef82/packages/%40guardian/source-react-components/src/accordion/AccordionRow.tsx

import { css } from '@emotion/react';
import type { EmotionJSX } from '@emotion/react/types/jsx-namespace';
import {
	brand,
	neutral,
	space,
	transitions,
} from '@guardian/source-foundations';
import { Radio } from '@guardian/source-react-components';
import type { RecentlySignedInExistingPaymentMethod } from 'helpers/forms/existingPaymentMethods/existingPaymentMethods';
import {
	getExistingPaymentMethodLabel,
	mapExistingPaymentMethodToPaymentMethod,
	subscriptionsToExplainerList,
	subscriptionToExplainerPart,
} from 'helpers/forms/existingPaymentMethods/existingPaymentMethods';
import type { PaymentMethod } from 'helpers/forms/paymentMethods';
import { paymentMethodData } from './paymentMethodData';
import { PaymentMethodLabel } from './paymentMethodLabel';
import { RadioWithImage } from './radioWithImage';

const explainerListContainer = css`
	font-size: small;
	font-style: italic;
	margin-left: 40px;
	padding-bottom: 6px;
	color: #767676;
	padding-right: 40px;
`;

const radio = css`
	padding: ${space[2]}px ${space[4]}px;
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
	background-image: linear-gradient(to top, ${brand[500]} 4px, transparent 4px);
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
	updateExistingPaymentMethod?: (
		existingPaymentMethod: RecentlySignedInExistingPaymentMethod,
	) => void;
	paymentMethod: PaymentMethod | null;
	existingPaymentMethod: RecentlySignedInExistingPaymentMethod | undefined;
}

export function ExistingPaymentMethodAccordionRow({
	paymentMethod,
	preExistingPaymentMethod,
	existingPaymentMethod,
	updateExistingPaymentMethod,
	expanded,
}: ExistingPaymentMethodAccordionRowProps): EmotionJSX.Element {
	return (
		<div>
			<Radio
				id={`paymentMethod-existing${preExistingPaymentMethod.billingAccountId}`}
				name="paymentMethod"
				type="radio"
				value={preExistingPaymentMethod.paymentType}
				onChange={() => {
					updateExistingPaymentMethod?.(preExistingPaymentMethod);
				}}
				aria-expanded={expanded}
				checked={
					paymentMethod ===
						mapExistingPaymentMethodToPaymentMethod(preExistingPaymentMethod) &&
					existingPaymentMethod === preExistingPaymentMethod
				}
				arial-labelledby="payment_method"
				label={
					<PaymentMethodLabel
						label={getExistingPaymentMethodLabel(preExistingPaymentMethod)}
						logo={
							paymentMethodData[
								mapExistingPaymentMethodToPaymentMethod(
									preExistingPaymentMethod,
								)
							].icon
						}
						isChecked={existingPaymentMethod === preExistingPaymentMethod}
					/>
				}
			/>

			<div css={explainerListContainer}>
				Used for your{' '}
				{subscriptionsToExplainerList(
					preExistingPaymentMethod.subscriptions.map(
						subscriptionToExplainerPart,
					),
				)}
			</div>

			{/* Accordion Body */}
			<div css={expanded ? expandedBody : collapsedBody}>
				<div hidden={!expanded}>
					i am the expanded body i am the expanded body i am the expanded body i
					am the expanded body i am the expanded body Lorem ipsum dolor sit
					amet, consectetur adipisicing elit. Ut expedita autem neque sed in
					unde impedit molestiae? Asperiores quo accusamus exercitationem ex
					omnis ipsum voluptatum accusantium culpa! Accusamus, repellat
					consectetur! Lorem ipsum dolor sit amet consectetur adipisicing elit.
					Quae, aspernatur et quas vero pariatur magnam dolor velit minus
					temporibus ad veniam quaerat! Vero molestias quod modi fugit nihil et
					ad.
				</div>
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
