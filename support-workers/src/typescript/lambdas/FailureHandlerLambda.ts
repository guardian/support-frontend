import type { SendAcquisitionEventState } from '../model/sendAcquisitionEventState';
import type { WrappedState } from '../model/stateSchemas';

export const handler = async (
	state: WrappedState<SendAcquisitionEventState>,
) => {
	console.info(`Input is ${JSON.stringify(state)}`);
};
