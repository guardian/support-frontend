import { css } from '@emotion/react';
import { storage } from '@guardian/libs';
import {
	space,
	textSans14,
	textSans17,
	titlepiece42,
} from '@guardian/source/foundations';
import { useState } from 'react';
import {
	FeatureSwitchesProvider,
	useFeatureSwitches,
} from 'contexts/FeatureSwitchesContext';
import { isSwitchOn } from 'helpers/globalsAndSwitches/globals';
import type { FeatureSwitches } from 'helpers/globalsAndSwitches/window';
import { renderPage } from 'helpers/rendering/render';

const pageStyles = css`
	max-width: 740px;
	margin: 0 auto;
	padding: ${space[6]}px ${space[4]}px;
`;

const headingStyles = css`
	${titlepiece42};
	margin-bottom: ${space[6]}px;
`;

const switchRowStyles = css`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: ${space[3]}px 0;
	border-bottom: 1px solid #dcdcdc;
`;

const labelStyles = css`
	${textSans17};
	font-weight: bold;
`;

const statusStyles = (isOn: boolean) => css`
	${textSans14};
	color: ${isOn ? '#22874d' : '#c70000'};
	margin-left: ${space[2]}px;
`;

const toggleStyles = (isOn: boolean) => css`
	position: relative;
	width: 44px;
	height: 24px;
	background: ${isOn ? '#22874d' : '#999'};
	border-radius: 12px;
	cursor: pointer;
	border: none;
	padding: 0;
	transition: background 0.2s;
	flex-shrink: 0;

	&::after {
		content: '';
		position: absolute;
		top: 2px;
		left: ${isOn ? '22px' : '2px'};
		width: 20px;
		height: 20px;
		background: white;
		border-radius: 50%;
		transition: left 0.2s;
	}
`;

const resetButtonStyles = css`
	${textSans14};
	margin-left: ${space[3]}px;
	background: none;
	border: 1px solid #999;
	border-radius: 4px;
	padding: ${space[1]}px ${space[2]}px;
	cursor: pointer;
	color: #555;
`;

const bannerStyles = css`
	${textSans14};
	background: #ffe500;
	padding: ${space[3]}px ${space[4]}px;
	margin-bottom: ${space[6]}px;
	border-left: 4px solid #ffbb00;
`;

type FlagKey = keyof FeatureSwitches;
type FlagState = Record<FlagKey, boolean>;

function getFlags(): FlagState {
	const featureSwitches = useFeatureSwitches();

	return featureSwitches;
}

function getActiveOverrides(flags: FlagState): Set<string> {
	return new Set(
		(Object.keys(flags) as FlagKey[]).filter(
			(flag) => storage.session.get(flag) !== null,
		),
	);
}

function SwitchRow({
	flag,
	isOn,
	hasOverride,
	onToggle,
	onReset,
}: {
	flag: string;
	isOn: boolean;
	hasOverride: boolean;
	onToggle: () => void;
	onReset: () => void;
}) {
	return (
		<div css={switchRowStyles}>
			<span>
				<span css={labelStyles}>{flag}</span>
				<span css={statusStyles(isOn)}>{isOn ? 'On' : 'Off'}</span>
				{hasOverride && (
					<span css={statusStyles(false)}> (session override)</span>
				)}
			</span>
			<span>
				{hasOverride && (
					<button css={resetButtonStyles} onClick={onReset} type="button">
						Reset
					</button>
				)}
				<button
					css={toggleStyles(isOn)}
					onClick={onToggle}
					type="button"
					aria-label={`Toggle ${flag}`}
					aria-pressed={isOn}
				/>
			</span>
		</div>
	);
}

export function SwitchesPage() {
	const [flags, setFlags] = useState<FlagState>(getFlags);
	const [overrides, setOverrides] = useState<Set<string>>(() =>
		getActiveOverrides(flags),
	);

	const toggle = (flag: FlagKey) => {
		const next = !flags[flag];
		storage.session.set(flag, next ? 'On' : 'Off');
		setFlags((prev) => ({ ...prev, [flag]: next }));
		setOverrides((prev) => new Set(prev).add(flag));
	};

	const reset = (flag: FlagKey) => {
		storage.session.remove(flag);
		setFlags((prev) => ({
			...prev,
			[flag]: isSwitchOn(`featureSwitches.${flag}`),
		}));
		setOverrides((prev) => {
			const next = new Set(prev);
			next.delete(flag);
			return next;
		});
	};

	return (
		<div css={pageStyles}>
			<h1 css={headingStyles}>Feature Switches</h1>
			{overrides.size > 0 && (
				<p css={bannerStyles}>
					{overrides.size} active session override
					{overrides.size > 1 ? 's' : ''} — these will be cleared when the
					session ends.
				</p>
			)}
			{(Object.keys(flags) as FlagKey[]).map((flag) => (
				<SwitchRow
					key={flag}
					flag={flag}
					isOn={flags[flag]}
					hasOverride={overrides.has(flag)}
					onToggle={() => toggle(flag)}
					onReset={() => reset(flag)}
				/>
			))}
		</div>
	);
}

renderPage(
	<FeatureSwitchesProvider>
		<SwitchesPage />
	</FeatureSwitchesProvider>,
);
