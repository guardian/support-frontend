import type { ThankYouModuleType } from './thankYouModule';

export const getThankYouModuleIcon = (
	moduleType: ThankYouModuleType,
): JSX.Element => {
	switch (moduleType) {
		case 'appDownload':
			return <DownloadTheAppIcon />;
		case 'feedback':
			return <FeedbackIcon />;

		/////////////////////////
		// ADD REMAINING ICONS //
		/////////////////////////
		default:
			return <SvgWrapper />;
	}
};

interface SvgWrapperProps {
	size?: number;
	children?: React.ReactNode;
}

function SvgWrapper(props: SvgWrapperProps) {
	return (
		<svg
			width={props.size ?? '31'}
			height={props.size ?? '31'}
			viewBox="0 0 31 31"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			{props.children}
		</svg>
	);
}

interface ThankYouModuleIconProps {
	size?: number;
}

function DownloadTheAppIcon(props: ThankYouModuleIconProps) {
	return (
		<SvgWrapper size={props.size ?? 31}>
			<g>
				<rect
					x="0.675781"
					y="0.414062"
					width="29.8787"
					height="29.8787"
					fill="url(#pattern0)"
				/>
				<defs>
					<pattern
						id="pattern0"
						patternContentUnits="objectBoundingBox"
						width="1"
						height="1"
					>
						<use xlinkHref="#image0_90_15868" transform="scale(0.00444444)" />
					</pattern>
					<image
						id="image0_90_15868"
						width="225"
						height="225"
						xlinkHref="data:image/png;base64,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"
					/>
				</defs>
			</g>
		</SvgWrapper>
	);
}

function FeedbackIcon(props: ThankYouModuleIconProps) {
	return (
		<SvgWrapper size={props.size ?? 31}>
			<g>
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M27.4166 16.4666V12.35H23.2999V10.45H27.4166V6.33331H29.3166V10.45H33.4332V12.35H29.3166V16.4666H27.4166ZM20.7666 11.4C20.7666 15.5799 24.1866 18.9999 28.3666 18.9999V23.4333L26.4666 25.3332H15.6999L11.8683 31.6666H10.6333V25.3332H7.43498L5.56665 23.4333V12.0333L7.46664 10.1333H20.8616C20.7983 10.545 20.7666 10.9883 20.7666 11.4Z"
					fill="#121212"
				/>
			</g>
		</SvgWrapper>
	);
}
