import { css } from '@emotion/react';
import {
	arrow,
	autoUpdate,
	flip,
	FloatingPortal,
	offset,
	shift,
	useClick,
	useDismiss,
	useFloating,
	useFocus,
	useInteractions,
	useRole,
} from '@floating-ui/react';
import { between, from, textSans, until } from '@guardian/source-foundations';
import { Button, SvgCross } from '@guardian/source-react-components';
import { useRef, useState } from 'react';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { InfoRound } from './InfoRound';

const container = css`
	display: inline-block;
	margin-top: 2px;
`;

const tooltipContainer = css`
	position: relative;
	display: flex;

	${until.mobileMedium} {
		> div {
			left: 0 !important;
			right: 0;
			margin-left: 24px;
			margin-right: auto;
		}
	}

	${between.mobileMedium.and.mobileLandscape} {
		> div {
			left: 74px !important;
		}
	}
`;

const tooltipCss = css`
	${textSans.small()};
	background-color: #606060;
	color: white;
	padding: 12px 24px 16px 16px;
	border-radius: 4px;
	max-width: 273px;
`;

const buttonOverrides = css`
	width: fit-content;
	height: max-content;
	min-height: initial;
	border: none;

	& svg {
		width: 17px;
		height: 16px;
	}
`;

const closeButtonOverrides = css`
	width: max-content;
	height: max-content;
	margin-right: 8px;
	margin-top: 0;
	position: absolute;
	top: 0;
	right: 0;
	color: white;
	background-color: transparent;
	&:hover {
		background-color: transparent;
	}
	& svg {
		width: 16px;
		margin: 2px;
	}
`;

const tooltipCopy = {
	uk: 'You can cancel anytime before your next payment date. If you cancel in the first 14 days, you will receive a full refund.',
	row: 'You can cancel online anytime before your next payment date. If you cancel in the first 14 days, you will receive a full refund.',
};

export default function Tooltip({
	countryGroupId,
}: {
	countryGroupId: CountryGroupId;
}): JSX.Element {
	const [open, setOpen] = useState(false);
	const arrowRef = useRef(null);

	const { x, y, refs, strategy, context } = useFloating({
		open,
		onOpenChange: setOpen,
		placement: 'top',
		// Make sure the tooltip stays on the screen
		whileElementsMounted: autoUpdate,
		middleware: [
			offset({
				mainAxis: 16,
				crossAxis: 80,
			}),
			flip({
				// Ensure the tooltip only appears above / below reference element
				fallbackPlacements: ['top', 'bottom'],
			}),
			shift(),
			arrow({
				element: arrowRef,
			}),
		],
	});

	// Event listeners to change the open state
	const click = useClick(context);
	const focus = useFocus(context);
	const dismiss = useDismiss(context);

	// Role props for screen readers
	const role = useRole(context, { role: 'tooltip' });

	// Merge all the interactions into prop getters
	const { getReferenceProps, getFloatingProps } = useInteractions([
		click,
		focus,
		dismiss,
		role,
	]);

	const arrowBottom = css`
		position: absolute;
		top: 100%;
		border-color: #606060 transparent transparent transparent;
		margin-left: -8px;
		border-width: 8px;
		border-style: solid;
		left: 50%;

		${from.mobileMedium} {
			left: 31.5%;
		}

		${from.mobileLandscape} {
			left: 20.5%;
		}
	`;

	const arrowTop = css`
		position: absolute;
		bottom: 100%;
		margin-left: -8px;
		border-width: 8px;
		border-style: solid;
		border-color: transparent transparent #606060 transparent;
		left: 50%;

		${from.mobileMedium} {
			left: 31.5%;
		}

		${from.mobileLandscape} {
			left: 20.5%;
		}
	`;

	return (
		<div css={container}>
			<div ref={refs.setReference} {...getReferenceProps()}>
				<Button
					hideLabel
					icon={<InfoRound />}
					priority="tertiary"
					css={buttonOverrides}
				/>
			</div>
			<FloatingPortal>
				{open && (
					<div css={tooltipContainer}>
						<div
							css={tooltipCss}
							ref={refs.setFloating}
							style={{
								// Positioning styles
								position: strategy,
								top: y ?? 0,
								left: x ?? 0,
							}}
							{...getFloatingProps()}
						>
							{countryGroupId === 'GBPCountries'
								? tooltipCopy.uk
								: tooltipCopy.row}
							<Button
								onClick={() => setOpen(false)}
								icon={<SvgCross size="xsmall" />}
								size="small"
								hideLabel
								priority="secondary"
								cssOverrides={closeButtonOverrides}
							/>
							<div
								css={context.placement === 'top' ? arrowBottom : arrowTop}
							></div>
						</div>
					</div>
				)}
			</FloatingPortal>
		</div>
	);
}
