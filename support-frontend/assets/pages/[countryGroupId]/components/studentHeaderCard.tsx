import type { GeoId } from 'pages/geoIdConfig';

type StudentHeaderCardProps = {
	geoId: GeoId;
};

export function StudentHeaderCard({
	geoId,
}: StudentHeaderCardProps): JSX.Element {
	return <div>Student Header Cards {geoId}</div>;
}
