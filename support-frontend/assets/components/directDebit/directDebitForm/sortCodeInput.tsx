import { Label } from '@guardian/source-react-components';
import * as React from 'react';
import { fieldLabel, textField } from './directDebitFormStyles';

type SortCodePropTypes = {
	sortCodeString: string;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
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
			pattern="[0-9]*"
			minLength={6}
			maxLength={6}
			css={textField}
		/>
	);
}

function SortCodeInput(props: SortCodePropTypes): JSX.Element {
	return (
		<div>
			<Label text="Sort Code" htmlFor="sort-code-input" css={fieldLabel} />
			<span>
				<SortCodeField
					id="qa-sort-code"
					value={props.sortCodeString}
					onChange={(event) => props.onChange(event)}
				/>
			</span>
		</div>
	);
}

export default SortCodeInput;
