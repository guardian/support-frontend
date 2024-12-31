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

export type HeadlineReturnCTAProp = {
	returnAddress: string;
};

export function HeadlineReturn(): JSX.Element {
	return (
		<p>
			Copy to prompt users to enjoy the Guardian with non personalised
			advertising
		</p>
	);
}

export function HeadlineReturnCTA({
	returnAddress,
}: HeadlineReturnCTAProp): JSX.Element {
	return (
		<LinkButton
			cssOverrides={btnStyleOverrides}
			href={returnAddress}
			size="default"
			icon={<SvgArrowRightStraight />}
			iconSide="right"
			nudgeIcon
			aria-label="Click to continue to the Guardian"
		>
			Continue to the Guardian
		</LinkButton>
	);
}
