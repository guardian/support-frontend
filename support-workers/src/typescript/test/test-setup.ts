jest.mock('../model/stage', () => ({
	stageFromEnvironment: jest.fn().mockReturnValue('CODE'),
}));

jest.mock('node:console', () => ({
	log: () => {},
	info: () => {},
	warn: () => {},
	error: () => {},
}));
