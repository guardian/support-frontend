import { css } from '@emotion/react';
import { space } from '@guardian/source-foundations';
import {
	Option as OptionForSelect,
	Select,
} from '@guardian/source-react-components';
import { InfoSummary } from '@guardian/source-react-components-development-kitchen';
import type { ActionCreatorWithOptionalPayload } from '@reduxjs/toolkit';
import type { DeliveryAgentsResponse } from 'helpers/redux/checkout/addressMeta/state';
import type { FormError } from 'helpers/subscriptionsForms/validation';
import { firstError } from 'helpers/subscriptionsForms/validation';

const marginBottom = css`
	margin-bottom: ${space[6]}px;
`;

const singleDeliveryProviderCss = css(marginBottom, `border: 0;`);

interface DeliveryAgentsSelectProps {
	deliveryAgentsResponse?: DeliveryAgentsResponse;
	setDeliveryAgent: ActionCreatorWithOptionalPayload<
		number | undefined,
		'addressMeta/setDeliveryAgent'
	>;
	formErrors: Array<FormError<string>>;
}

export function DeliveryAgentsSelect(
	props: DeliveryAgentsSelectProps,
): JSX.Element | null {
	if (props.deliveryAgentsResponse?.type === 'Covered') {
		if (props.deliveryAgentsResponse.agents?.length === 1) {
			const singleDeliveryProvider = props.deliveryAgentsResponse.agents[0];

			return (
				<InfoSummary
					css={singleDeliveryProviderCss}
					context={
						<>
							<i>{singleDeliveryProvider.agentName}</i> will deliver your
							newspaper.
						</>
					}
					message=""
				/>
			);
		}

		return (
			<Select
				label="Select delivery provider"
				id="delivery-provider"
				css={marginBottom}
				onChange={(e) => props.setDeliveryAgent(parseInt(e.target.value))}
				error={firstError('deliveryProvider', props.formErrors)}
			>
				<OptionForSelect value="">Click to select</OptionForSelect>
				<>
					{props.deliveryAgentsResponse.agents?.map((agent) => (
						<OptionForSelect value={agent.agentId}>
							{agent.agentName}
						</OptionForSelect>
					))}
				</>
			</Select>
		);
	}

	return null;
}
