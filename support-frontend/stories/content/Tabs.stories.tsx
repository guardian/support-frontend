import { expect } from '@storybook/jest';
import { userEvent, waitFor, within } from '@storybook/testing-library';
import type { TabProps } from 'components/tabs/tabs';
import TabsComponent from 'components/tabs/tabs';

const tabsContent = [
	{
		id: 'cat',
		text: 'Cats',
		selected: true,
		content: (
			<p>
				Cat ipsum dolor sit amet, side-eyes your "jerk" other hand while being
				petted. Eat a rug and furry furry hairs everywhere oh no human coming
				lie on counter don't get off counter. Meow in empty rooms i vomit in the
				bed in the middle of the night cereal boxes make for five star
				accommodation but sit on human they not getting up ever and i'm bored
				inside, let me out i'm lonely outside, let me in i can't make up my mind
				whether to go in or out, guess i'll just stand partway in and partway
				out, contemplating the universe for half an hour how dare you nudge me
				with your foot?!?!
			</p>
		),
	},
	{
		id: 'dog',
		text: 'Dogs',
		selected: false,
		content: (
			<p>
				Doggo ipsum bork borkdrive very taste wow wow very biscit vvv, heckin
				angery woofer heck much ruin diet thicc, pupperino yapper shooberino.
				Sub woofer he made many woofs boof puggo porgo boof sub woofer, shoob
				borking doggo doge such treat. You are doin me a concern what a nice
				floof shoob very taste wow, borking doggo heckin good boys and girls.
				Big ol porgo what a nice floof h*ck I am bekom fat very good spot,
				maximum borkdrive pupper blep. Heckin I am bekom fat thicc wow very
				biscit most angery pupper I have ever seen, heckin good boys lotsa pats
				snoot. Maximum borkdrive very jealous pupper he made many woofs porgo
				pats, lotsa pats dat tungg tho.
			</p>
		),
	},
];

const tabInteraction = async ({
	args,
	canvasElement,
}: {
	args: {
		onTabChange: (tabId: string) => void;
	};
	canvasElement: HTMLCanvasElement;
}) => {
	const canvas = within(canvasElement);

	userEvent.click(canvas.getByRole('tab', { selected: false }));

	await waitFor(() => {
		expect(args.onTabChange).toHaveBeenCalled();
	});
};

export default {
	title: 'Content/Tabs',
	component: TabsComponent,
	argTypes: { onTabChange: { action: 'tab changed' } },
	decorators: [
		(Story: React.FC): JSX.Element => (
			<div
				style={{
					padding: '48px',
				}}
			>
				<Story />
			</div>
		),
	],
};

function Template(args: {
	tabsContent: TabProps[];
	onTabChange: (tabId: string) => void;
}): JSX.Element {
	return (
		<TabsComponent
			tabsLabel="Pets"
			tabElement="button"
			tabs={args.tabsContent}
			onTabChange={args.onTabChange}
		/>
	);
}

Template.args = {} as Record<string, unknown>;
Template.play = tabInteraction;

export const FirstTabSelected = Template.bind({});

FirstTabSelected.args = {
	tabsContent,
};

FirstTabSelected.play = tabInteraction;

export const SecondTabSelected = Template.bind({});

SecondTabSelected.args = {
	tabsContent: tabsContent.map((tab) => ({ ...tab, selected: !tab.selected })),
};

SecondTabSelected.play = tabInteraction;
