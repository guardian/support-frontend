jest.mock('../model/stage', () => ({
	stageFromEnvironment: jest.fn().mockReturnValue('CODE'),
}));
