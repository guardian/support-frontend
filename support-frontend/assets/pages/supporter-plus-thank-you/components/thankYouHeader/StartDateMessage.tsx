import { css } from '@emotion/react';
import { space } from '@guardian/source/foundations';
import { formatUserDate } from 'helpers/utilities/dateConversions';

const startDateStyle = css`
	margin-bottom: ${space[2]}px;
`;

export default function StartDateMessage({
	startDate,
}: {
	startDate?: string;
}) {
	if (!startDate) {return null;}

	return (
		<p css={startDateStyle}>
			{startDate &&
				`Your first issue will be published on ${formatUserDate(
					new Date(startDate),
				)}.`}
		</p>
	);
}
