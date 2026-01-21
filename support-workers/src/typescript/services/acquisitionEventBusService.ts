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
					Time: new Date(),
					EventBusName: this.eventBusName,
					Source: 'support-workers.1',
					DetailType: 'AcquisitionsEvent',
					Detail: JSON.stringify(acquisitionEvent),
				},
			],
		});

		console.log(`EventBridge PutEventsCommand: ${JSON.stringify(command)}`);

		const result = await this.eventBridgeClient.send(command);
		console.log(`EventBridge response: ${JSON.stringify(result)}`);
	}
}
