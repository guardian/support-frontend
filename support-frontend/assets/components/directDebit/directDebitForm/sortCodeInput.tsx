import { Label } from '@guardian/source-react-components';
import * as React from 'react';
import type { SortCodeIndex } from 'helpers/redux/checkout/payment/directDebit/state';
import {
	fieldLabel,
	sortCodeField,
	sortCodeSeparator,
} from './directDebitFormStyles';

type SortCodePropTypes = {
	sortCodeArray: string[];
	onChange: (
		index: SortCodeIndex,
		event: React.ChangeEvent<HTMLInputElement>,
	) => void;
};

function SortCodeField(props: {
	id: string;
	value: string;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
	return (
		<input
			id={props.id}
			data-qm-masking="blocklist"
			value={props.value}
			onChange={props.onChange}
			type="tel"
			pattern="[0-9][0-9]"
			minLength={2}
			maxLength={2}
			css={sortCodeField}
		/>
	);
}

function SortCodeInput(props: SortCodePropTypes): JSX.Element {
	return (
		<div>
			<Label text="Sort Code" htmlFor="sort-code-input" css={fieldLabel} />
			<span>
				<SortCodeField
					id="qa-sort-code-1"
					value={props.sortCodeArray[0]}
					onChange={(event) => props.onChange(0, event)}
				/>
				<span css={sortCodeSeparator}>&mdash;</span>
				<SortCodeField
					id="qa-sort-code-2"
					value={props.sortCodeArray[1]}
					onChange={(event) => props.onChange(1, event)}
				/>
				<span css={sortCodeSeparator}>&mdash;</span>
				<SortCodeField
					id="qa-sort-code-3"
					value={props.sortCodeArray[2]}
					onChange={(event) => props.onChange(2, event)}
				/>
			</span>
		</div>
	);
}

export default SortCodeInput;
