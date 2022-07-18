import CentredContainer from 'components/containers/centredContainer';
import type { RoundelTheme } from 'components/page/heroRoundel';
import HeroRoundel from 'components/page/heroRoundel';

export default {
	title: 'Product Page/Hero Roundel',
	component: HeroRoundel,
	decorators: [
		(Story: React.FC): JSX.Element => (
			<div
				style={{
					paddingTop: '100px',
				}}
			>
				<CentredContainer>
					<Story />
				</CentredContainer>
			</div>
		),
	],
};

function Template(args: { theme: RoundelTheme }) {
	return (
		<HeroRoundel theme={args.theme}>
			<div>
				<div
					style={{
						fontSize: '42px',
					}}
				>
					14 day
				</div>
				<div>free trial</div>
			</div>
		</HeroRoundel>
	);
}

Template.args = {} as Record<string, unknown>;

export const Base = Template.bind({});

Base.args = {
	theme: 'base',
};

export const Digital = Template.bind({});

Digital.args = {
	theme: 'digital',
};
