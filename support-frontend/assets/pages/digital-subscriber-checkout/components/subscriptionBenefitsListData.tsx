import { css } from '@emotion/react';
import type { CheckListData } from 'components/checkList/checkList';

const boldText = css`
	font-weight: bold;
`;

export const checkListData = (): CheckListData[] => {
	return [
		{
			isChecked: true,
			text: (
				<p>
					<span css={boldText}>The Editions app. </span>Enjoy the Guardian and
					Observer newspaper, reimagined for mobile and tablet
				</p>
			),
		},
		{
			isChecked: true,
			text: (
				<p>
					<span css={boldText}>A regular supporter newsletter. </span>Get
					exclusive insight from our newsroom
				</p>
			),
		},
		{
			isChecked: true,
			text: (
				<p>
					<span css={boldText}>Uninterrupted reading. </span> See far fewer asks
					for support
				</p>
			),
		},
		{
			isChecked: true,
			text: (
				<p>
					<span css={boldText}>Full access to our news app. </span>Read our
					reporting on the go
				</p>
			),
		},
		{
			isChecked: true,
			text: (
				<p>
					<span css={boldText}>Ad-free reading. </span>Avoid ads on all your
					devices
				</p>
			),
		},
		{
			isChecked: true,
			text: (
				<p>
					<span css={boldText}>Free 14 day trial. </span>Enjoy a free trial of
					your subscription, before you pay
				</p>
			),
		},
	];
};
