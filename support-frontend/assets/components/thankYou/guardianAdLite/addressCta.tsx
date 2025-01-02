import { css } from '@emotion/react';
import { space } from '@guardian/source/foundations';
import {
	LinkButton,
	SvgArrowRightStraight,
} from '@guardian/source/react-components';

const btnStyleOverrides = css`
	justify-content: left;
	margin-bottom: ${space[5]}px;
`;

export type AddressCtaProp = {
	copy: string;
	address: string;
	hasArrow?: boolean;
};

export function AddressCta({
	address,
	copy,
	hasArrow,
}: AddressCtaProp): JSX.Element {
	return (
		<>
			{hasArrow ? (
				<LinkButton
					cssOverrides={btnStyleOverrides}
					href={address}
					size="default"
					icon={<SvgArrowRightStraight />}
					iconSide="right"
					nudgeIcon
					aria-label={copy}
				>
					{copy}
				</LinkButton>
			) : (
				<LinkButton
					cssOverrides={btnStyleOverrides}
					href={address}
					size="default"
					aria-label={copy}
				>
					{copy}
				</LinkButton>
			)}
		</>
	);
}
