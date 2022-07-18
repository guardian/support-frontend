import CentredContainer from 'components/containers/centredContainer';
import GridImage from 'components/gridImage/gridImage';
import HeroComponent from 'components/page/hero';
import HeroRoundel from 'components/page/heroRoundel';

export default {
	title: 'Product Page/Hero',
	component: HeroComponent,
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

export function Hero(): JSX.Element {
	return (
		<HeroComponent
			image={
				<GridImage
					gridId="weeklyCampaignHeroImg"
					srcSizes={[500]}
					sizes="(max-width: 740px) 500px, 500px"
					imgType="png"
					altText="A collection of Guardian Weekly magazines"
				/>
			}
			roundelElement={
				<HeroRoundel theme="base">
					<div>Roundel</div>
				</HeroRoundel>
			}
		>
			<section
				style={{
					padding: '0 1rem',
				}}
			>
				<h1
					style={{
						fontSize: '42px',
						fontFamily: 'GH Guardian Headline',
					}}
				>
					Hero Heading
				</h1>
				<p
					style={{
						paddingTop: '1em',
					}}
				>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque id
					justo at est elementum egestas rhoncus eu nulla. Proin pellentesque
					massa at metus condimentum, a aliquam erat condimentum. Vivamus quis
					rutrum nulla. Curabitur ut ullamcorper magna, eu ornare nunc.
				</p>
			</section>
		</HeroComponent>
	);
}
