import type { SerializedStyles } from '@emotion/react';
import { css } from '@emotion/react';
import { brand, neutral } from '@guardian/source-foundations';
import { Radio } from '@guardian/source-react-components';
import type { ReactNode } from 'react';

const radioWithImageStyles = css`
	display: inline-flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
`;

const paymentIcon = css`
	display: flex;
	min-width: 30px;
`;

const defaultRadioLabelColour = css`
	color: ${neutral[46]};
	font-weight: bold;
`;

const checkedRadioLabelColour = css`
	color: ${brand[400]};
	font-weight: bold;
`;

function getLabelText(
	label: string,
	checked: boolean,
	isSupporterPlus: boolean | undefined,
): ReactNode {
	const radioLabelColour = checked
		? checkedRadioLabelColour
		: defaultRadioLabelColour;

	return <p css={isSupporterPlus ? radioLabelColour : undefined}>{label}</p>;
}

type RadioWithImagePropTypes = {
	id: string;
	image: ReactNode;
	label: string;
	name: string;
	checked: boolean;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	cssOverrides?: SerializedStyles | SerializedStyles[];
	isSupporterPlus?: boolean;
	supportingText?: string;
};

export function RadioWithImage({
	id,
	image,
	label,
	checked,
	name,
	onChange,
	cssOverrides,
	isSupporterPlus,
	supportingText,
}: RadioWithImagePropTypes): JSX.Element {
	return (
		<label
			htmlFor={id}
			css={css`
				cursor: pointer;
			`}
		>
			<div css={[radioWithImageStyles, cssOverrides]} onChange={onChange}>
				<Radio
					id={id}
					label={getLabelText(label, checked, isSupporterPlus)}
					checked={checked}
					name={name}
					supporting={supportingText}
					cssOverrides={css`
						color: ${neutral[46]};
					`}
				/>
				<div css={paymentIcon}>{image}</div>
			</div>
		</label>
	);
}
