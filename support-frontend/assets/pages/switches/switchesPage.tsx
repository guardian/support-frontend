import { storage } from '@guardian/libs';
import { Button, SvgBin } from '@guardian/source/react-components';
import { ToggleSwitch } from '@guardian/source-development-kitchen/react-components';
import { useState } from 'react';
import {
	FeatureSwitchesProvider,
	useFeatureSwitches,
} from 'contexts/FeatureSwitchesContext';
import { isSwitchOn } from 'helpers/globalsAndSwitches/globals';
import type { FeatureSwitches } from 'helpers/globalsAndSwitches/window';
import { renderPage } from 'helpers/rendering/render';
import {
	bannerContainerStyles,
	bannerStyles,
	headingStyles,
	labelActionsStyles,
	labelStyles,
	pageStyles,
	statusStyles,
	switchRowStyles,
} from './switchesPageStyles';

type FlagKey = keyof FeatureSwitches;
type FlagState = Record<FlagKey, boolean>;

function getOverrides(flags: FlagState): Set<string> {
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
			<div>
				<span css={labelStyles}>{flag}</span>
				<span css={statusStyles(isOn)}>{isOn ? 'On' : 'Off'}</span>
				{hasOverride && (
					<span css={statusStyles(false)}> (session override)</span>
				)}
			</div>
			<div css={labelActionsStyles}>
				{hasOverride && (
					<Button
						size="xsmall"
						onClick={onReset}
						type="button"
						priority="tertiary"
						icon={<SvgBin />}
					>
						Reset
					</Button>
				)}
				<ToggleSwitch onClick={onToggle} checked={isOn} />
			</div>
		</div>
	);
}

export function SwitchesPage() {
	const [flags, setFlags] = useState<FlagState>(useFeatureSwitches());
	const [overrides, setOverrides] = useState<Set<string>>(() =>
		getOverrides(flags),
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
			<div css={bannerContainerStyles}>
				{overrides.size > 0 && (
					<p css={bannerStyles}>
						{overrides.size} Active session override
						{overrides.size > 1 ? 's' : ''} — these will be cleared when the
						session ends.
					</p>
				)}
			</div>
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
