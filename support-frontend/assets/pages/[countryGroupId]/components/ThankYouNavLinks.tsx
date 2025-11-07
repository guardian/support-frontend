import { css, useTheme } from '@emotion/react';
import { space, until } from '@guardian/source/foundations';
import { LinkButton } from '@guardian/source/react-components';
import { getObserverButtonProps } from 'components/observer-layout/observerButtonProps';
import {
	OPHAN_COMPONENT_ID_RETURN_TO_GUARDIAN,
	OPHAN_COMPONENT_ID_RETURN_TO_OBSERVER,
} from 'helpers/thankYouPages/utils/ophan';
import { trackComponentClick } from 'helpers/tracking/behaviour';

const buttonContainer = css`
	position: absolute;
	bottom: ${space[8]}px;
	& > a:first-child {
		margin-right: ${space[3]}px;
	}
	${until.tablet} {
		& > a {
			margin-bottom: ${space[4]}px;
		}
	}
`;

export default function ThankYouNavLinks({
	isObserverPrint,
	isGuardianAdLite,
}: {
	isObserverPrint: boolean;
	isGuardianAdLite: boolean;
}) {
	const { observerThemeButton } = useTheme();
	const props = observerThemeButton && getObserverButtonProps();
	const buttonText = observerThemeButton
		? 'Get Started'
		: 'Return to the Observer';

	return (
		<div css={buttonContainer}>
			{isObserverPrint && (
				<LinkButton
					href="https://www.observer.co.uk/welcome"
					priority="tertiary"
					theme={observerThemeButton}
					{...props}
					onClick={() =>
						trackComponentClick(OPHAN_COMPONENT_ID_RETURN_TO_OBSERVER)
					}
				>
					{buttonText}
				</LinkButton>
			)}

			{!isGuardianAdLite && !observerThemeButton && (
				<LinkButton
					href="https://www.theguardian.com"
					priority="tertiary"
					onClick={() =>
						trackComponentClick(OPHAN_COMPONENT_ID_RETURN_TO_GUARDIAN)
					}
				>
					Return to the Guardian
				</LinkButton>
			)}
		</div>
	);
}
