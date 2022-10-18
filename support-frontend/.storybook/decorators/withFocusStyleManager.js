import { useEffect } from 'react';
import { FocusStyleManager } from '@guardian/source-foundations';

export function withFocusStyleManager(storyFn) {
	useEffect(() => {
		FocusStyleManager.onlyShowFocusOnTabs();
	});

	return <>{storyFn()}</>;
};
