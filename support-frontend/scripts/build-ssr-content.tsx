import { writeFileSync } from 'fs';
import { resolve } from 'path';
import { renderToString } from 'react-dom/server';
import { HoldingContent } from '../assets/components/serverSideRendered/holdingContent';
import { NewspaperArchiveHeader } from '../assets/components/serverSideRendered/newspaperArchiveHeader';

const ssrComponents = [
	{ component: <HoldingContent />, fileName: 'ssr-holding-content' },
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
