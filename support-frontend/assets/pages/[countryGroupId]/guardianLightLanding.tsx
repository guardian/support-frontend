import {
	Accordion,
	AccordionRow,
	Container,
} from '@guardian/source/react-components';
import { Box } from 'components/checkoutBox/checkoutBox';
import type { GeoId } from 'pages/geoIdConfig';
import { getGeoIdConfig } from 'pages/geoIdConfig';
import { CheckoutLayout } from './components/checkoutLayout';

type GuardianLightLandingProps = {
	geoId: GeoId;
};

export function GuardianLightLanding({
	geoId,
}: GuardianLightLandingProps): JSX.Element {
	const { currencyKey, countryGroupId } = getGeoIdConfig(geoId);
	return (
		<CheckoutLayout>
			<Box>
				<div>
					GuardianLightLanding ${currencyKey} ${countryGroupId}
				</div>
			</Box>
			<Box>
				<div>
					start
					<Accordion>
						<AccordionRow label="Collecting from multiple newsagents">
							Present your card to a newsagent each time you collect the paper.
							The newsagent will scan your card and will be reimbursed for each
							transaction automatically.
						</AccordionRow>
						<AccordionRow label="Delivery from your retailer">
							Simply give your preferred store / retailer the barcode printed on
							your subscription letter.
						</AccordionRow>
					</Accordion>
					stop
				</div>
			</Box>
			<Container sideBorders borderColor="rgba(170, 170, 180, 0.5)">
				<Accordion>
					<AccordionRow label="Collecting from multiple newsagents">
						Present your card to a newsagent each time you collect the paper.
						The newsagent will scan your card and will be reimbursed for each
						transaction automatically.
					</AccordionRow>
					<AccordionRow label="Delivery from your retailer">
						Simply give your preferred store / retailer the barcode printed on
						your subscription letter.
					</AccordionRow>
				</Accordion>
			</Container>
		</CheckoutLayout>
	);
}
