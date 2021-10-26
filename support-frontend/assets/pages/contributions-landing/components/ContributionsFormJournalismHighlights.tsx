// ----- Imports ----- //

import { css } from '@emotion/core';
import { space } from '@guardian/src-foundations';
import { from } from '@guardian/src-foundations/mq';
import { neutral } from '@guardian/src-foundations/palette';
import { body, headline, textSans } from '@guardian/src-foundations/typography';
import { Hide } from '@guardian/src-layout';
import React from 'react';

// ----- Types ----- //

type Copy = {
	header: string;
	body: string;
};

type ImgAttrs = {
	url: string;
	alt: string;
};

type JournalismHighlight = {
	mobileCopy: Copy;
	desktopCopy: Copy;
	imgAttrs: ImgAttrs;
};

// ----- Data ----- //

const highlightsData: JournalismHighlight[] = [
	{
		mobileCopy: {
			header: 'The climate crisis',
			body: 'Our correspondents cover humanity’s greatest challenge, reporting on climate hotspots and the latest science, and interrogating the words and actions of those in power.',
		},
		desktopCopy: {
			header: 'Daily environmental journalism – urgent, sober, galvanising',
			body: 'Our team of global correspondents cover humanity’s greatest challenge, reporting from climate emergency hotspots as well as on ominous slow-motion changes to the planet. We distill the latest science and interrogate the words and actions of those in power about plans to combat global heating. We aren’t just covering the climate crisis, we are confronting it as an organisation too - rejecting fossil fuel advertising, divesting from dirty companies and aiming for net zero emissions within a decade.',
		},
		imgAttrs: {
			url: 'https://media.guim.co.uk/d1a27999cca2afa509f79834c96b955bded4ebbe/0_0_4928_3280/1000.jpg',
			alt: 'Man looking at wildfire',
		},
	},
	{
		mobileCopy: {
			header: 'Investigations',
			body: 'Corruption, incompetence, sleaze, oppression and hypocrisy – our investigative journalists delve into the toxic issues of today and expose glaring injustices that need correcting.',
		},
		desktopCopy: {
			header: 'Our investigations change the world',
			body: 'Corruption, incompetence, political sleaze, oppression, inequality, hypocrisy and outright lies – our investigative journalists delve into the toxic issues polluting 21st century life and expose glaring injustices that need correcting. Snowden, Wikileaks, Cambridge Analytica, the Panama Papers: our rollcall of stories that have changed the world is long – and expanding.',
		},
		imgAttrs: {
			url: 'https://media.guim.co.uk/cfa50c07512e949583e0864e65cbfa13d7b454db/0_162_4928_2956/1000.jpg',
			alt: 'Edward Snowden',
		},
	},
	{
		mobileCopy: {
			header: 'Global politics',
			body: 'Elections, summits, leadership tussles and policy debates: Guardian correspondents in dozens of countries keep close to the politics, scrutinising those in power and investigating long-term trends.',
		},
		desktopCopy: {
			header: 'Politics round the clock, around the world',
			body: 'If it matters, we cover it. Elections, summits, leadership tussles, diplomatic rows and policy debates: Guardian correspondents in dozens of countries keep close to the politics, interviewing leaders, reporting on major initiatives, investigating long-term threats to democracy  and liveblogging all the important national votes as they unfold.',
		},
		imgAttrs: {
			url: 'https://media.guim.co.uk/40540e68c3e9df90cd3101ec07c220b5c159b9b1/0_0_4000_2615/1000.jpg',
			alt: 'Joe Biden and Vladimir Putin shaking hands',
		},
	},
	{
		mobileCopy: {
			header: 'Big tech',
			body: 'Tech is a superpower, a game-changer, an enabler and an oppressor – and our journalists scrutinise it closely to ensure that people control technology and not the other way around.',
		},
		desktopCopy: {
			header: 'Big tech: the good, the bad and the ugly',
			body: 'Tech is a superpower, a game-changer, an enabler and an oppressor – and our journalists scrutinise it closely to ensure that people control technology and not the other way around. Privacy violations, the tech oligarchy, state snooping and artificial intelligence are our main preoccupations. And we deploy our own technology to make a stand for fairness, making all our journalism open and free for everyone to read, wherever they are.',
		},
		imgAttrs: {
			url: 'https://media.guim.co.uk/5693fa938c56cec79d8c86af0ef39b92504ead44/0_42_3500_2101/1000.jpg',
			alt: 'Screenshot of face tracking software',
		},
	},
	{
		mobileCopy: {
			header: 'The reliance on science',
			body: 'Science is paramount, as Covid-19 proved. And our team of scholarly journalists bring you the most credible, authoritative science of the day, from astronomy to zoology.',
		},
		desktopCopy: {
			header: 'The reliance on science',
			body: 'Recent years have demonstrated more than ever the paramount importance of good science, and our team of scholarly journalists filter out the psychobabble and nonsense to bring you the best science of the day, from astronomy to zoology, from public health to health fads. With a team of data journalists alongside we zero in on the stories in numbers, and the numbers in stories.',
		},
		imgAttrs: {
			url: 'https://media.guim.co.uk/c0c56ffa3b4b22eab77402fbfb9e737707a8a4d2/0_0_5400_3602/1000.jpg',
			alt: 'The Milky Way galaxy',
		},
	},
	{
		mobileCopy: {
			header: 'Our cultural world',
			body: 'Art, books, drama, dance, music, festivals, films and food: all our Guardian platforms are peppered with a rich seasoning of cultural coverage.',
		},
		desktopCopy: {
			header: 'Our interior world',
			body: 'Art, books, drama, dance, music, festivals, films and food: the arts form a vital, vivid reflection and interpretation of our lives. All our Guardian platforms are peppered with a rich seasoning of cultural coverage, the things we want to read when we crave a much-needed break from the relentless crises of world news.',
		},
		imgAttrs: {
			url: 'https://media.guim.co.uk/b25dd2e64d9285010f020e6923828a1429d2507a/0_0_7383_4922/1000.jpg',
			alt: 'Outdoor theatre performance',
		},
	},
	{
		mobileCopy: {
			header: 'Capitalism’s failings',
			body: 'The gap between the rich and poor is widening fast. The Guardian’s reporting asks who benefits from the systems that control our lives, and who is harmed.',
		},
		desktopCopy: {
			header: 'The failures of capitalism',
			body: 'Around the world, the gap between the rich and poor is widening fast, as billionaires and corporations tighten their hold on the institutions that should be holding them to account. At the Guardian, our reporting – from politics to food, race to pollution – probes the interests behind the systems that control our lives, and the impact on those most harmed by them.',
		},
		imgAttrs: {
			url: 'https://media.guim.co.uk/5420e646c4edb197d5c3871a475805ed78a8b065/0_0_5000_3000/1000.jpg',
			alt: 'Anti-capitalist protest',
		},
	},
];

// ----- Styles ----- //

const styles = {
	headerAndIntroContainer: css`
		padding: 0 ${space[3]}px;

		${from.desktop} {
			padding: 0;
		}
	`,
	intro: css`
		${headline.xxsmall({ fontWeight: 'light' })};
		margin-top: ${space[2]}px;

		${from.desktop} {
			margin-top: ${space[5]}px;
		}

		${from.wide} {
			${headline.xsmall({ fontWeight: 'light' })};
		}
	`,
	introBold: css`
		${headline.xxsmall({ fontWeight: 'bold' })};

		${from.wide} {
			${headline.xsmall({ fontWeight: 'bold' })};
		}
	`,
	header: css`
		${headline.xxsmall({ fontWeight: 'bold' })};

		${from.desktop} {
			${headline.xlarge({ fontWeight: 'bold' })};
		}
	`,
	highlightsContainer: css`
		margin-top: ${space[5]}px;

		${from.desktop} {
			margin-top: ${space[9]}px;
		}
	`,
};

// ----- Component ----- //

export function ContributionsFormJournalismHighlights(): JSX.Element {
	return (
		<section>
			<div css={styles.headerAndIntroContainer}>
				<header css={styles.header}>
					<h1>Support high-impact reporting like this</h1>
				</header>

				<p css={styles.intro}>
					Millions turn to the Guardian every day for fiercely independent
					journalism that’s open for everyone to read. Our unique ownership
					gives us the freedom to investigate the powerful without fear.{' '}
					<span css={styles.introBold}>
						Show your support today with a contribution of any size. Thank you.
					</span>
				</p>
			</div>

			<div css={styles.highlightsContainer}>
				<JournalismHighlightList highlights={highlightsData} />
			</div>
		</section>
	);
}

// ----- Helpers ----- //

type JournalismHighlighListItemProps = {
	highlight: JournalismHighlight;
};

type JournalismHighlightListProps = {
	highlights: JournalismHighlight[];
};

const highlightsStyles = {
	container: css`
		li:not(:first-child) {
			margin-top: ${space[3]}px;

			${from.wide} {
				margin-top: ${space[9]}px;
			}
		}
	`,
};

function JournalismHighlightList({ highlights }: JournalismHighlightListProps) {
	return (
		<ul css={highlightsStyles.container}>
			{highlights.map((highlight) => (
				<li>
					<JournalismHighlightListItem highlight={highlight} />
				</li>
			))}
		</ul>
	);
}

const highlightStyles = {
	imageContainer: css`
		position: relative;
		width: 100%;
		height: 0;
		overflow: hidden;
		padding-bottom: 65%;

		img {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			display: block;
			object-fit: cover;
		}
	`,
	article: css`
		margin: -${space[6]}px ${space[4]}px 0;
		padding: ${space[1]}px ${space[3]}px ${space[5]}px;
		background: ${neutral[100]};
		position: relative;
	`,
	articleHeader: css`
		h2 {
			${headline.xxxsmall({ fontWeight: 'bold' })}
		}

		time {
			${textSans.small()}
			color: ${neutral[46]};
		}
	`,
	articleBody: css`
		${body.small()}

		${from.desktop} {
			margin-top: ${space[1]}px;
		}
	`,
};

function JournalismHighlightListItem({
	highlight,
}: JournalismHighlighListItemProps) {
	const { imgAttrs, mobileCopy, desktopCopy } = highlight;

	return (
		<section>
			<div css={highlightStyles.imageContainer}>
				<img src={imgAttrs.url} alt={imgAttrs.alt} />
			</div>

			<article css={highlightStyles.article}>
				<header css={highlightStyles.articleHeader}>
					<h2>
						<Hide above="desktop">{mobileCopy.header}</Hide>
						<Hide below="desktop">{desktopCopy.header}</Hide>
					</h2>
				</header>

				<p css={highlightStyles.articleBody}>
					<Hide above="desktop">{mobileCopy.body}</Hide>
					<Hide below="desktop">{desktopCopy.body}</Hide>
				</p>
			</article>
		</section>
	);
}
