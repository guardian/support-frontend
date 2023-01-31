import { css } from '@emotion/react';
import {
	arrow,
	autoUpdate,
	flip,
	FloatingPortal,
	offset,
	shift,
	useDismiss,
	useFloating,
	useFocus,
	useHover,
	useInteractions,
	useRole,
} from '@floating-ui/react';
import { from, textSans, until } from '@guardian/source-foundations';
import { Button, SvgCross } from '@guardian/source-react-components';
import { useRef, useState } from 'react';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { InfoRound } from './InfoRound';

const container = css`
	display: inline-block;
	margin-top: 2px;
`;

const tooltipContainer = css`
	${until.mobileLandscape} {
		position: relative;
		display: flex;
		justify-content: center;

		> div {
			left: 0 !important;
			right: 0;
			margin-left: auto;
			margin-right: auto;
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

const arrowBottom = css`
	position: absolute;
	top: 100%;
	border-color: #606060 transparent transparent transparent;
	margin-left: -8px;
	border-width: 8px;
	border-style: solid;

	${from.mobileLandscape} {
		left: 20.5%;
	}

	// TODO - tweak arrow position
	${until.mobileLandscape} {
		display: none;
	}
`;

const arrowTop = css`
	position: absolute;
	bottom: 100%;
	margin-left: -8px;
	border-width: 8px;
	border-style: solid;
	border-color: transparent transparent #606060 transparent;

	${from.mobileLandscape} {
		left: 20.5%;
	}

	// TODO - tweak arrow position
	${until.mobileLandscape} {
		display: none;
	}
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
	margin-top: 4px;
	position: absolute;
	top: 0;
	right: 0;
	color: white;
	background-color: transparent;
	&:hover {
		background-color: transparent;
	}
	& svg {
		width: 13px;
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
	const hover = useHover(context, { move: false });
	const focus = useFocus(context);
	const dismiss = useDismiss(context);

	// Role props for screen readers
	const role = useRole(context, { role: 'tooltip' });

	// Merge all the interactions into prop getters
	const { getReferenceProps, getFloatingProps } = useInteractions([
		hover,
		focus,
		dismiss,
		role,
	]);

	const onClose = () => useDismiss(context);

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
								onClick={onClose}
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
