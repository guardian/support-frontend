import { Global } from '@emotion/react';
import ObserverPageLayout from 'components/observer-layout/ObserverPageLayout';
import { PrerenderGlobalStyles } from 'helpers/rendering/prerenderGlobalStyles';
import { reset } from 'stylesheets/emotion/reset';

export function ObserverHoldingContent() {
	return (
		<>
			<Global styles={reset} />
			<PrerenderGlobalStyles />
			<ObserverPageLayout>{null}</ObserverPageLayout>
		</>
	);
}
