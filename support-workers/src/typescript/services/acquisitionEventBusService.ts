import {
	EventBridgeClient,
	PutEventsCommand,
} from '@aws-sdk/client-eventbridge';
import type { AcquisitionDataRow } from '../acquisitionData/acquisitionDataRowBuilder';
import type { Stage } from '../model/stage';
import { awsConfig } from '../util/awsConfig';

export class AcquisitionEventBusService {
	constructor(stage: Stage) {
		this.eventBusName = 'acquisitions-bus-' + stage;
	}
	private eventBusName: string;
	private eventBridgeClient = new EventBridgeClient(awsConfig);

	async sendEvent(acquisitionEvent: AcquisitionDataRow) {
		const command = new PutEventsCommand({
			Entries: [
				{
					EventBusName: this.eventBusName,
					Source: 'support-workers.sendAcquisitionEventLambda',
					DetailType: 'AcquisitionsEvent',
					Detail: JSON.stringify(acquisitionEvent),
				},
			],
		});

		await this.eventBridgeClient.send(command);
	}
}
