import { radios, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';
import CentredContainer from 'components/containers/centredContainer';
import GridImage from 'components/gridImage/gridImage';
import Block from 'components/page/block';
import Hero from 'components/page/hero';
import HeroRoundel from 'components/page/heroRoundel';
import PageTitle from 'components/page/pageTitle';

const stories = storiesOf('Page composition components', module).addDecorator(
	withKnobs,
);
const DemoHero = (
	<Hero
		image={
			<GridImage
				gridId="weeklyCampaignHeroImg"
				srcSizes={[500]}
				sizes="(max-width: 740px) 500px, 500px"
				imgType="png"
				altText="A collection of Guardian Weekly magazines"
			/>
		}
		roundelText={
			<div>
				<div>First</div>
				<div>issue</div>
				<div>free</div>
			</div>
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
	</Hero>
);
stories.add('Hero', () => (
	<div
		style={{
			width: '100%',
			paddingTop: '100px',
		}}
	>
		<CentredContainer>{DemoHero}</CentredContainer>
	</div>
));
stories.add('HeroRoundel', () => (
	<div
		style={{
			paddingTop: '100px',
		}}
	>
		<CentredContainer>
			<HeroRoundel theme="digital">
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
		</CentredContainer>
	</div>
));
stories.add('Header', () => {
	const theme = radios(
		'Theme',
		{
			showcase: 'showcase',
			digital: 'digital',
			paper: 'paper',
			weekly: 'weekly',
		},
		'digital',
	);
	return (
		<PageTitle title="Page Title" theme={theme}>
			<CentredContainer>{DemoHero}</CentredContainer>
		</PageTitle>
	);
});
stories.add('Block', () => (
	<CentredContainer>
		<Block>
			<section
				style={{
					border: '1px solid black',
					padding: '1rem',
				}}
			>
				<p>This is a container for text or other content</p>
			</section>
		</Block>
	</CentredContainer>
));
