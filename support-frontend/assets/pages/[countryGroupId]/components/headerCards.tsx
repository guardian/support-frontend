import type { GeoId } from 'pages/geoIdConfig';

type HeaderCardsProps = {
	geoId: GeoId;
};

export function HeaderCards({ geoId }: HeaderCardsProps): JSX.Element {
	return <div>HeaderCards {geoId}</div>;
}
