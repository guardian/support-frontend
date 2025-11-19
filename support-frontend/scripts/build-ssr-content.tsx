import { writeFileSync } from 'fs';
import { resolve } from 'path';
import { renderToString } from 'react-dom/server';
import { GuardianHoldingContent } from '../assets/components/serverSideRendered/guardianHoldingContent';
import { NewspaperArchiveHeader } from '../assets/components/serverSideRendered/newspaperArchiveHeader';
import { ObserverHoldingContent } from '../assets/components/serverSideRendered/observerHoldingContent';

const ssrComponents = [
	{ component: <GuardianHoldingContent />, fileName: 'ssr-holding-content' },
	{
		component: <ObserverHoldingContent />,
		fileName: 'ssr-observer-holding-content',
	},
	{
		component: <NewspaperArchiveHeader />,
		fileName: 'ssr-newspaper-archive-header',
	},
] as const;

for (const ssrComponent of ssrComponents) {
	const html = renderToString(ssrComponent.component);
	writeFileSync(
		resolve(__dirname, '../conf/ssr-cache/', `${ssrComponent.fileName}.html`),
		html,
		'utf8',
	);
}
