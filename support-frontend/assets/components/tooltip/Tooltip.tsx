import { css } from '@emotion/react';
import type { Placement } from '@floating-ui/react';
import {
	autoUpdate,
	flip,
	FloatingPortal,
	offset,
	shift,
	useClick,
	useDismiss,
	useFloating,
	useInteractions,
} from '@floating-ui/react';
import {
	between,
	from,
	space,
	textSans15,
	until,
	visuallyHidden,
} from '@guardian/source/foundations';
import { Button, SvgCross } from '@guardian/source/react-components';
import { useState } from 'react';
import { InfoRound } from './InfoRound';

const buttonAndTooltipContainer = css`
	display: inline-block;
	margin-top: 2px;
`;

const tooltipAndCopyContainer = css`
	display: flex;
	cursor: pointer;
	position: relative;
	margin-top: ${space[3]}px;
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

	${between.mobileLandscape.and.tablet} {
		> div {
			left: 94px !important;
		}
	}
`;

const tooltipContainerDisplay = (open: boolean, desktopOnly?: boolean) => css`
	${!open && visuallyHidden}
	${until.desktop} {
		${desktopOnly && visuallyHidden}
	}
`;

const tooltipCss = css`
	overflow: hidden;
	${textSans15};
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

const copy = css`
	font-weight: bold;
	display: inline-block;
	margin-right: ${space[2]}px;

	${until.tablet} {
		margin-bottom: ${space[2]}px;
	}
`;

const arrowBottom = css`
	position: absolute;
	top: 100%;
	border-color: #606060 transparent transparent transparent;
	margin-left: -8px;
	border-width: 8px;
	border-style: solid;
	left: 49%;

	${from.mobileMedium} {
		left: 31%;
	}

	${from.mobileLandscape} {
		left: 27%;
	}

	${from.tablet} {
		left: 23%;
	}

	${from.desktop} {
		left: 10%;
	}
`;

const arrowTop = css`
	position: absolute;
	bottom: 100%;
	margin-left: -8px;
	border-width: 8px;
	border-style: solid;
	border-color: transparent transparent #606060 transparent;
	left: 49%;

	${from.mobileMedium} {
		left: 31%;
	}

	${from.mobileLandscape} {
		left: 27%;
	}

	${from.tablet} {
		left: 23%;
	}

	${from.desktop} {
		left: 10%;
	}
`;

export type TooltipProps = {
	promptText?: string;
	buttonLabel?: string;
	children: React.ReactNode;
	xAxisOffset?: number;
	yAxisOffset?: number;
	placement?: Placement;
	desktopOnly?: boolean;
};

export default function Tooltip({
	promptText,
	buttonLabel = 'More information',
	children,
	xAxisOffset,
	yAxisOffset,
	placement,
	desktopOnly,
}: TooltipProps): JSX.Element {
	const [open, setOpen] = useState(false);

	const { x, y, refs, strategy, context } = useFloating({
		open,
		onOpenChange: setOpen,
		placement: placement ?? 'top',
		// Make sure the tooltip stays on the screen
		whileElementsMounted: autoUpdate,
		middleware: [
			offset({
				mainAxis: yAxisOffset ?? 16,
				crossAxis: xAxisOffset ?? 0,
			}),
			flip({
				// Ensure the tooltip only appears above / below reference element
				fallbackPlacements: ['top', 'bottom'],
			}),
			shift(),
		],
	});

	// Event listeners to change the open state
	const click = useClick(context, { toggle: false });
	const dismiss = useDismiss(context);

	// Merge all the interactions into prop getters
	const { getReferenceProps, getFloatingProps } = useInteractions([
		click,
		dismiss,
	]);

	return (
		<div
			css={tooltipAndCopyContainer}
			ref={refs.setReference}
			{...getReferenceProps()}
		>
			{promptText && <p css={copy}>{promptText}</p>}
			<div css={buttonAndTooltipContainer}>
				<div>
					<Button
						hideLabel
						icon={<InfoRound />}
						priority="tertiary"
						cssOverrides={buttonOverrides}
					>
						{buttonLabel}
					</Button>
				</div>
				<FloatingPortal>
					<div
						role="status"
						css={[tooltipContainer, tooltipContainerDisplay(open, desktopOnly)]}
						ref={refs.setFloating}
						style={{
							// Positioning styles
							position: strategy,
							top: Number(y),
							left: Number(x),
						}}
						{...getFloatingProps()}
					>
						<div css={tooltipCss}>
							{children}
							<Button
								onClick={() => setOpen(false)}
								icon={<SvgCross size="xsmall" />}
								size="small"
								hideLabel
								priority="secondary"
								cssOverrides={closeButtonOverrides}
							>
								Close
							</Button>
							<div
								css={context.placement === 'top' ? arrowBottom : arrowTop}
							></div>
						</div>
					</div>
				</FloatingPortal>
			</div>
		</div>
	);
}
