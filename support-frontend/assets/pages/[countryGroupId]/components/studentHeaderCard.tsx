import { css } from '@emotion/react';
import { palette, space } from '@guardian/source/foundations';
import { Container } from 'components/layout/container';
import type { GeoId } from 'pages/geoIdConfig';

const container = css`
	background-color: ${palette.brand[400]};
	position: relative;
	> div {
		max-width: 620px;
		background-color: ${palette.neutral[97]};
		padding: ${space[3]}px;
		display: flex;
		justify-content: center;
		border-radius: ${space[3]}px;
	}
`;

type StudentHeaderCardProps = {
	geoId: GeoId;
};

export function StudentHeaderCard({
	geoId,
}: StudentHeaderCardProps): JSX.Element {
	return (
		<Container sideBorders cssOverrides={container}>
			<div>Student Header Card ({geoId})</div>
		</Container>
	);
}
