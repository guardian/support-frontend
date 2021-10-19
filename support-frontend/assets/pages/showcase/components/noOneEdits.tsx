import React from 'react';
import Content from 'components/content/content';
import NoOne from 'components/svgs/noOne';
import Text from 'components/text/text';

export default function NoOneEdits() {
	return (
		<Content appearance="grey">
			<Text>
				<NoOne />
				<p>
					Our journalism is editorially independent, meaning we set our own
					agenda. No one edits our editor and no one steers our opinion. We are
					free from commercial bias and are not influenced by billionaire
					owners, politicians or shareholders. This independence matters because
					it enables us to challenge the powerful, and hold them to account.
				</p>
			</Text>
		</Content>
	);
}
