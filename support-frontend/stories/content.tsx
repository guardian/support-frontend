import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { text, withKnobs } from '@storybook/addon-knobs';
import { List, ListWithSubText } from 'components/list/list';
import BlockLabel from 'components/blockLabel/blockLabel';
import InteractiveTable from 'components/interactiveTable/interactiveTable';
import {
	headers,
	footer,
	getRows,
} from 'pages/digital-subscription-landing/components/comparison/interactiveTableContents';
const stories = storiesOf('Content components', module).addDecorator(
	withKnobs({
		escapeHTML: false,
	}),
);
stories.add('List', () => (
	<div
		style={{
			padding: '8px',
		}}
	>
		<List
			items={[
				{
					content: 'This is a list',
				},
				{
					content:
						"You can put items in it, even if they're long sentences that will definitely overflow and wrap on mobile",
				},
				{
					content: "It's very nice",
				},
			]}
		/>

		<ListWithSubText
			bulletColour="dark"
			bulletSize="small"
			items={[
				{
					content: 'This is a list',
					subText: 'With optional sub text',
				},
				{
					content: "It's useful in several situations",
					subText:
						'Like when you want to add extra information for each list item',
				},
				{
					content: "But you don't have to use it",
				},
			]}
		/>
	</div>
));

stories.add('Block label', () => (
	<BlockLabel>Use this for stand-out labels on other content</BlockLabel>
));
stories.add('Interactive table', () => (
	<div
		style={{
			maxWidth: '940px',
			margin: '0 auto',
			backgroundColor: '#DCDCDC',
		}}
	>
		<InteractiveTable
			caption={<>What&apos;s included in a paid digital subscription</>}
			headers={headers}
			rows={getRows('GBPCountries')}
			footer={footer}
		/>
	</div>
));
