import { css } from '@emotion/react';
import { palette, space } from '@guardian/source/foundations';
import {
	LinkButton,
	SvgArrowRightStraight,
} from '@guardian/source/react-components';
import { sendTrackingEventsOnClick } from 'helpers/productPrice/subscriptions';
import { helpCentreUrl, manageSubsUrl } from 'helpers/urls/externalLinks';

const btnStyleOverrides = css`
	justify-content: left;
	margin-bottom: ${space[5]}px;
`;

const neutralFontColor = css`
	color: ${palette.neutral[0]};
`;

type AddressCtaProp = {
	copy: string;
	address: string;
	hasArrow?: boolean;
};

export function AddressCta({
	address,
	copy,
	hasArrow = false,
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

export const myAccountCta = (
	<a
		css={neutralFontColor}
		href={manageSubsUrl}
		onClick={sendTrackingEventsOnClick({
			id: 'checkout_my_account',
			product: 'Paper',
			componentType: 'ACQUISITIONS_BUTTON',
		})}
	>
		Manage my account
	</a>
);

export const helpCenterCta = (linkCopy: string) => (
	<a
		css={neutralFontColor}
		href={helpCentreUrl}
		onClick={sendTrackingEventsOnClick({
			id: 'checkout_help_centre',
			product: 'Paper',
			componentType: 'ACQUISITIONS_BUTTON',
		})}
	>
		{linkCopy}
	</a>
);
