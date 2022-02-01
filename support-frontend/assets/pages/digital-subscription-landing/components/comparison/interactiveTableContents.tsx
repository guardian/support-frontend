import { css } from '@emotion/core';
import { space } from '@guardian/src-foundations';
import { from } from '@guardian/src-foundations/mq';
import React from 'react';
import { SvgFreeTrial } from 'components/icons/freeTrial';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import 'helpers/internationalisation/countryGroup';
import { getLocalisedRows } from './interactiveTableRowContents';

const iconSizeMobile = 28;
const iconSizeDesktop = 34;
const descriptionIcon = css`
	display: inline-flex;
	align-self: center;
	height: ${iconSizeMobile}px;
	width: ${iconSizeMobile}px;
	margin-right: ${space[2]}px;
	svg {
		height: ${iconSizeMobile}px;
		width: ${iconSizeMobile}px;
	}

	${from.phablet} {
		height: ${iconSizeDesktop}px;
		width: ${iconSizeDesktop}px;

		svg {
			height: ${iconSizeDesktop}px;
			width: ${iconSizeDesktop}px;
		}
	}
`;
export function getRows(countryGroupId: CountryGroupId) {
	const isUsa = countryGroupId === 'UnitedStates';
	const {
		journalism,
		adFree,
		editionsApp,
		premiumApp,
		offlineReading,
		crosswords,
	} = getLocalisedRows(countryGroupId);
	return [
		journalism,
		adFree,
		...(isUsa ? [premiumApp, editionsApp] : [editionsApp, premiumApp]),
		offlineReading,
		crosswords,
	];
}
export const headers = [
	{
		content: 'Benefits',
		isHidden: true,
	},
	{
		content: 'Free',
		isIcon: true,
	},
	{
		content: 'Paid',
		isIcon: true,
	},
	{
		content: 'Actions',
		isHidden: true,
	},
	{
		content: 'More Details',
		isHidden: true,
		isStyleless: true,
	},
];
export const footer = (
	<>
		<div css={descriptionIcon}>
			<SvgFreeTrial />
		</div>
		<span>Plus a 14 day free trial</span>
	</>
);
