import type { SerializedStyles } from '@emotion/react';
import { css } from '@emotion/react';
import { Radio } from '@guardian/source-react-components';
import type { ReactNode } from 'react';

const radioWithImageStyles = css`
	display: inline-flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
`;

const paymentIcon = css`
	min-width: 30px;
	max-width: 40px;
`;

type RadioWithImagePropTypes = {
	id: string;
	image: ReactNode;
	label: string;
	name: string;
	checked: boolean;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	cssOverrides?: SerializedStyles | SerializedStyles[];
};

export function RadioWithImage({
	id,
	image,
	label,
	checked,
	name,
	onChange,
	cssOverrides,
}: RadioWithImagePropTypes): JSX.Element {
	return (
		<div css={[radioWithImageStyles, cssOverrides]}>
			<Radio
				id={id}
				label={label}
				checked={checked}
				name={name}
				onChange={onChange}
			/>
			<div css={paymentIcon}>{image}</div>
		</div>
	);
}
