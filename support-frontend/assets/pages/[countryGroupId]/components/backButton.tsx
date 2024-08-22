import { Button } from '@guardian/source/react-components';
import type { GeoId } from 'pages/geoIdConfig';

type BackButtonProps = {
	geoId: GeoId;
	buttonText: string;
};

export function BackButton({ geoId, buttonText }: BackButtonProps) {
	return (
		<a href={`/${geoId}/contribute`}>
			<Button priority="tertiary" size="xsmall" role="link">
				{buttonText}
			</Button>
		</a>
	);
}
