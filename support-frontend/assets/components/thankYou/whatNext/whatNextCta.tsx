import { css } from '@emotion/react';
import { palette, space } from '@guardian/source/foundations';
import {
	LinkButton,
	SvgArrowRightStraight,
} from '@guardian/source/react-components';
import { sendTrackingEventsOnClick } from 'helpers/productPrice/subscriptions';
import { getHelpCentreUrl, getManageSubsUrl } from 'helpers/urls/externalLinks';

const btnStyleOverrides = css`
	justify-content: left;
	margin-bottom: ${space[5]}px;
`;

const neutralFontColor = css`
	color: ${palette.neutral[0]};
`;

type AddressCtaProp = {
	copy: string;
	getAddress: () => string;
	hasArrow?: boolean;
};

export function AddressCta({
	getAddress,
	copy,
	hasArrow = false,
}: AddressCtaProp): JSX.Element {
	return (
		<>
			{hasArrow ? (
				<LinkButton
					cssOverrides={btnStyleOverrides}
					href={getAddress()}
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
					href={getAddress()}
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
		href={getManageSubsUrl()}
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
		href={getHelpCentreUrl()}
		onClick={sendTrackingEventsOnClick({
			id: 'checkout_help_centre',
			product: 'Paper',
			componentType: 'ACQUISITIONS_BUTTON',
		})}
	>
		{linkCopy}
	</a>
);
