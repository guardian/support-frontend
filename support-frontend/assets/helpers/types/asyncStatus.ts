export const Initial = 'initial';
export const Pending = 'pending';
export const Completed = 'completed';
export const Failed = 'failed';

export type AsyncStatus =
	| typeof Initial
	| typeof Pending
	| typeof Completed
	| typeof Failed;
