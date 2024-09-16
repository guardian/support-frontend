import { css } from '@emotion/react';
import { isOneOf } from '@guardian/libs';
import { palette, space, textSans15, textSans17, textSansItalic15 } from '@guardian/source/foundations';
import { Label, Radio, RadioGroup } from '@guardian/source/react-components';
import type { ActionCreatorWithOptionalPayload } from '@reduxjs/toolkit';
import type {
	DeliveryAgentOption,
	DeliveryAgentsResponse,
} from 'helpers/redux/checkout/addressMeta/state';
import type { FormError } from 'helpers/subscriptionsForms/validation';
import { firstError } from 'helpers/subscriptionsForms/validation';

const marginBottom = css`
	margin-bottom: ${space[6]}px;
`;

const singleDeliveryProviderCss = css(marginBottom, `border: 0;`);

const greenDeliveryMethods = ['green delivery', 'green options'] as const;
type GreenDeliveryMethod = (typeof greenDeliveryMethods)[number];

interface DeliveryAgentsSelectProps {
	chosenDeliveryAgent?: number;
	deliveryAgentsResponse?: DeliveryAgentsResponse;
	setDeliveryAgent: ActionCreatorWithOptionalPayload<
		number | undefined,
		'addressMeta/setDeliveryAgent'
	>;
	formErrors: Array<FormError<string>>;
	deliveryAddressErrors: Array<FormError<string>>;
}

export function DeliveryAgentsSelect(
	props: DeliveryAgentsSelectProps,
): JSX.Element | null {
	const postcodeError = firstError('postCode', props.deliveryAddressErrors);

	if (props.deliveryAgentsResponse?.type === 'Covered' && !postcodeError) {
		if (props.deliveryAgentsResponse.agents?.length === 1) {
			return (
				<SingleDeliveryProvider
					singleDeliveryProvider={props.deliveryAgentsResponse.agents[0]}
				/>
			);
		}

		return (
			<RadioGroup
				label="Select delivery provider"
				id="delivery-provider"
				css={marginBottom}
				error={firstError('deliveryProvider', props.formErrors)}
			>
				<>
					{props.deliveryAgentsResponse.agents?.map((agent) => (
						<div
							css={css`
								border-bottom: 1px solid ${palette.neutral[86]};
							`}
							key={agent.agentId}
						>
							<Radio
								value={agent.agentId}
								checked={props.chosenDeliveryAgent === agent.agentId}
								onChange={() => props.setDeliveryAgent(agent.agentId)}
								label={
									<>
										{agent.agentName}{' '}
										<GreenLabel deliveryMethod={agent.deliveryMethod} />
									</>
								}
							/>
							<DeliveryProviderSummary summary={agent.summary} />
							<GreenDeliverySummary deliveryMethod={agent.deliveryMethod} />
						</div>
					))}
				</>
			</RadioGroup>
		);
	}

	return null;
}

function SingleDeliveryProvider({
	singleDeliveryProvider,
}: {
	singleDeliveryProvider: DeliveryAgentOption;
}) {
	return (
		<div css={singleDeliveryProviderCss}>
			<Label text="Delivery provider">
				<div
					css={css`
						${textSans17};
						margin-bottom: ${space[1]}px;
					`}
				>
					{' '}
					{singleDeliveryProvider.agentName}{' '}
					<GreenLabel deliveryMethod={singleDeliveryProvider.deliveryMethod} />
				</div>
				<DeliveryProviderSummary summary={singleDeliveryProvider.summary} />
				<GreenDeliverySummary
					deliveryMethod={singleDeliveryProvider.deliveryMethod}
				/>
			</Label>
		</div>
	);
}

function GreenLabel({ deliveryMethod }: { deliveryMethod: string }) {
	if (!isGreenOption(deliveryMethod.toLowerCase())) {
		return null;
	}

	return (
		<span
			css={css`
				color: ${palette.success[400]};
				${textSansItalic15};
			`}
		>
			{deliveryMethod}
		</span>
	);
}

function DeliveryProviderSummary({ summary }: { summary: string }) {
	if (!summary) {
		return null;
	}

	return (
		<p
			css={css`
				${textSans15};
				margin-bottom: ${space[2]}px;
			`}
		>
			{summary}
		</p>
	);
}

function GreenDeliverySummary({ deliveryMethod }: { deliveryMethod: string }) {
	deliveryMethod = deliveryMethod.toLowerCase();

	if (!isGreenOption(deliveryMethod)) {
		return null;
	}

	return (
		<p
			css={css`
				color: ${palette.success[400]};
				${textSansItalic15};
				margin-bottom: ${space[2]}px;
			`}
		>
			{getGreenSummary(deliveryMethod)}
		</p>
	);
}

function isGreenOption(
	deliveryMethod: string,
): deliveryMethod is GreenDeliveryMethod {
	const isGreenDeliveryMethod = isOneOf(greenDeliveryMethods);

	return isGreenDeliveryMethod(deliveryMethod);
}

function getGreenSummary(deliveryMethod: GreenDeliveryMethod) {
	switch (deliveryMethod) {
		case 'green delivery':
			return 'This provider will deliver your newspaper via foot, bicycle, or electric vehicle.';
		case 'green options':
			return 'This provider may deliver your newspaper via foot, bicycle, electric vehicle or petrol/diesel vehicle.';
	}
}
