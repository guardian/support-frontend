import InteractiveTableComponent from 'components/interactiveTable/interactiveTable';
import {
	footer,
	getRows,
	headers,
} from 'pages/digital-subscription-landing/components/comparison/interactiveTableContents';

export default {
	title: 'Content/Interactive Table',
	component: InteractiveTableComponent,
	decorators: [
		(Story: React.FC): JSX.Element => (
			<div
				style={{
					maxWidth: '940px',
					margin: '0 auto',
					backgroundColor: '#DCDCDC',
				}}
			>
				<Story />
			</div>
		),
	],
};

export function InteractiveTable(args: { isPatron: boolean }): JSX.Element {
	return (
		<div
			style={{
				maxWidth: '940px',
				margin: '0 auto',
				backgroundColor: '#DCDCDC',
			}}
		>
			<InteractiveTableComponent
				caption={<>What&apos;s included in a paid digital subscription</>}
				headers={headers}
				rows={getRows('GBPCountries', args.isPatron)}
				footer={footer}
			/>
		</div>
	);
}

InteractiveTable.args = {
	isPatron: false,
};
