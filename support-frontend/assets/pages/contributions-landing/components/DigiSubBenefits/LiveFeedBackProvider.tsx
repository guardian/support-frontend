import { createContext, useContext, useState } from 'react';

interface LiveFeedBackContextInterface {
	showLiveFeedBack: boolean;
	setShowLiveFeedBack: React.Dispatch<React.SetStateAction<boolean>>;
}

const LiveFeedBackContext = createContext<LiveFeedBackContextInterface | null>(
	null,
);
export const useLiveFeedBackContext = (): LiveFeedBackContextInterface | null =>
	useContext(LiveFeedBackContext);

function LiveFeedBackProvider({
	children,
}: {
	children: JSX.Element;
}): JSX.Element {
	const [showLiveFeedBack, setShowLiveFeedBack] = useState(false);

	const values: LiveFeedBackContextInterface = {
		showLiveFeedBack,
		setShowLiveFeedBack,
	};

	return (
		<LiveFeedBackContext.Provider value={values}>
			{children}
		</LiveFeedBackContext.Provider>
	);
}

export default LiveFeedBackProvider;
