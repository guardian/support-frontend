import { css } from '@emotion/react';
import CentredContainer from 'components/containers/centredContainer';
import GridPicture from 'components/gridPicture/gridPicture';
import HeroContainer from 'components/hero/HeroContainer';

// ---------------------------------------------------------------------------
// Shared slot fixtures — reused across stories to keep each story concise
// ---------------------------------------------------------------------------

/**
 * Responsive placeholder image used in all HeroContainer stories.
 * In a real page, replace these gridIds with actual asset identifiers
 * and tune `srcSizes`/`sizes` to match your layout's image dimensions.
 *
 * For full `GridPicture` prop documentation and source/breakpoint examples,
 * see the **Grid Images/GridPicture** story in Storybook
 * (stories/images/GridPicture.stories.tsx).
 */
function SampleImage(): JSX.Element {
	return (
		<GridPicture
			sources={[
				{
					gridId: 'placeholder_16x9',
					srcSizes: [962, 500],
					sizes: '240px',
					imgType: 'jpg',
					media: '(max-width: 739px)',
				},
				{
					gridId: 'placeholder_1x1',
					srcSizes: [802, 500],
					sizes: '200px',
					imgType: 'jpg',
					media: '(max-width: 979px)',
				},
				{
					gridId: 'placeholder_4x3',
					srcSizes: [962, 500],
					sizes: '240px',
					imgType: 'jpg',
					media: '(min-width: 980px)',
				},
			]}
			fallback="placeholder_4x3"
			fallbackSize={240}
			altText=""
		/>
	);
}

function SampleContent(): JSX.Element {
	return (
		<section>
			<h1>Support independent journalism</h1>
			<p>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque id
				justo at est elementum egestas rhoncus eu nulla. Proin pellentesque
				massa at metus condimentum, a aliquam erat condimentum. Vivamus quis
				rutrum nulla. Curabitur ut ullamcorper magna, eu ornare nunc.
			</p>
		</section>
	);
}

// ---------------------------------------------------------------------------
// Story metadata
// ---------------------------------------------------------------------------

export default {
	title: 'LandingPage/HeroContainer',
	component: HeroContainer,
	/**
	 * `parameters.docs.description.component` renders as the component overview
	 * at the top of the auto-generated Docs page.  Use it to explain the
	 * component's purpose, key props, and usage guidelines.
	 */
	parameters: {
		docs: {
			description: {
				component: `
\`HeroContainer\` provides a two-column landing-page hero layout with a
**content slot** (headings, body copy, CTAs) and an **image slot**.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| \`contentSlot\` | \`ReactNode\` | — | Text, headings, and call-to-action elements |
| \`imageSlot\` | \`ReactNode\` | — | An image or illustration |
| \`heroDirection\` | \`'default' \\| 'reverse'\` | \`'default'\` | \`'default'\` puts the image on the right; \`'reverse'\` puts it on the left |
| \`imagePosition\` | \`'float' \\| 'bottom'\` | \`'float'\` | \`'float'\` vertically centres the image; \`'bottom'\` pins it to the bottom edge |
| \`cssOverrides\` | \`SerializedStyles\` | — | Emotion CSS to override the container's default background/text colours |

## Usage

\`\`\`tsx
import { css } from '@emotion/react';
import HeroContainer from 'components/hero/HeroContainer';

<HeroContainer
  heroDirection="default"
  imagePosition="float"
  contentSlot={<YourContent />}
  imageSlot={<YourImage />}
  cssOverrides={css\`
    background-color: #052962;
    color: #fff;
  \`}
/>
\`\`\`

## Layout behaviour

- On **mobile** the image always stacks *above* the content regardless of \`heroDirection\`
  (the container uses \`flex-direction: column-reverse\`).
- On **tablet and above** the two columns sit side by side; the image column is
  45 % wide on tablet and 40 % on desktop.
- Use \`imagePosition="bottom"\` for illustrations that look grounded rather than floating.
- The default background is \`neutral[97]\` (light grey). Pass \`cssOverrides\` to apply
  brand colours — see the *Dark* and *Light* stories below for examples.
- It's common to serve a different image depending on the breakpoint.  For a responsive image solution, consider passing a \`GridPicture\` directly as the \`imageSlot\`, mirroring the pattern used in the **Grid Images/GridPicture** story in Storybook (stories/images/GridPicture.stories.tsx). 
				`,
			},
		},
	},
	decorators: [
		(Story: React.FC): JSX.Element => (
			<div
				style={{
					marginTop: '100px',
					padding: '50px 0',
					backgroundColor: '#EDEDED',
				}}
			>
				<CentredContainer>
					<Story />
				</CentredContainer>
			</div>
		),
	],
	argTypes: {
		heroDirection: {
			control: 'radio',
			options: ['default', 'reverse'],
			description:
				'Controls which side the image appears on (tablet and above)',
		},
		imagePosition: {
			control: 'radio',
			options: ['float', 'bottom'],
			description:
				'`float` vertically centres the image; `bottom` pins it to the bottom edge',
		},
		backgroundColor: {
			control: 'color',
			description: 'Hero background colour (applied via cssOverrides)',
		},
		color: {
			control: 'color',
			description: 'Hero text colour (applied via cssOverrides)',
		},
	},
	args: {
		heroDirection: 'default',
		imagePosition: 'float',
		backgroundColor: '#052962',
		color: '#fff',
	},
};

// ---------------------------------------------------------------------------
// Interactive / playground story
// ---------------------------------------------------------------------------

/**
 * Use the **Controls** panel to experiment with every prop combination in real
 * time.  This is the best starting point when integrating the component into a
 * new page.
 */
export function Hero({
	heroDirection,
	imagePosition,
	backgroundColor,
	color,
}: {
	heroDirection: 'default' | 'reverse';
	imagePosition: 'float' | 'bottom';
	backgroundColor: string;
	color: string;
}): JSX.Element {
	return (
		<HeroContainer
			imageSlot={<SampleImage />}
			contentSlot={<SampleContent />}
			heroDirection={heroDirection}
			imagePosition={imagePosition}
			cssOverrides={css`
				background-color: ${backgroundColor};
				color: ${color};
			`}
		/>
	);
}

// ---------------------------------------------------------------------------
// Named variant stories
// Each story documents a specific, intentional use-case.  Use these as
// reference implementations when building a new landing page.
// ---------------------------------------------------------------------------

/**
 * The default configuration: image on the right, vertically centred,
 * with Guardian dark-blue branding.
 */
export function Default(): JSX.Element {
	return (
		<HeroContainer
			imageSlot={<SampleImage />}
			contentSlot={<SampleContent />}
			cssOverrides={css`
				background-color: #052962;
				color: #fff;
			`}
		/>
	);
}

/**
 * Set \`heroDirection="reverse"\` to move the image to the **left** on tablet
 * and above.  Useful when the design calls for alternating hero rows.
 */
export function Reversed(): JSX.Element {
	return (
		<HeroContainer
			imageSlot={<SampleImage />}
			contentSlot={<SampleContent />}
			heroDirection="reverse"
			cssOverrides={css`
				background-color: #052962;
				color: #fff;
			`}
		/>
	);
}

/**
 * \`imagePosition="bottom"\` pins the image to the bottom of its column,
 * which works well for illustrations that have a natural "standing" pose
 * (e.g. characters or objects that should appear grounded).
 */
export function ImageAtBottom(): JSX.Element {
	return (
		<HeroContainer
			imageSlot={<SampleImage />}
			contentSlot={<SampleContent />}
			imagePosition="bottom"
			cssOverrides={css`
				background-color: #052962;
				color: #fff;
			`}
		/>
	);
}

/**
 * Example of passing a `GridPicture` directly as the `imageSlot`, mirroring
 * the pattern used in the **Grid Images/GridPicture** story.
 * See stories/images/GridPicture.stories.tsx for more `GridPicture` examples.
 *
 * For the current breakpoints/sizes used in this story, the image will switch between
 * the 16:9, 1:1, and 4:3 placeholders as the viewport width increases.
 *
 * click show code to view the full `GridPicture` configuration used in this example.
 */
export function WithGridPictureImageSlot(): JSX.Element {
	return (
		<HeroContainer
			imageSlot={
				<GridPicture
					sources={[
						{
							gridId: 'placeholder_16x9',
							srcSizes: [962, 500],
							sizes: '240px',
							imgType: 'jpg',
							media: '(max-width: 739px)',
						},
						{
							gridId: 'placeholder_1x1',
							srcSizes: [802, 500],
							sizes: '200px',
							imgType: 'jpg',
							media: '(max-width: 979px)',
						},
						{
							gridId: 'placeholder_4x3',
							srcSizes: [962, 500],
							sizes: '240px',
							imgType: 'jpg',
							media: '(min-width: 980px)',
						},
					]}
					fallback="placeholder_4x3"
					fallbackSize={240}
					altText=""
				/>
			}
			contentSlot={<SampleContent />}
			cssOverrides={css`
				background-color: #052962;
				color: #fff;
			`}
		/>
	);
}

WithGridPictureImageSlot.parameters = {
	docs: {
		source: {
			code: `
import { css } from '@emotion/react';
import GridPicture from 'components/gridPicture/gridPicture';
import HeroContainer from 'components/hero/HeroContainer';

<HeroContainer
  contentSlot={<YourContent />}
  imageSlot={
  <GridPicture
		sources={[
			{
				gridId: 'placeholder_16x9',
				srcSizes: [962, 500],
				sizes: '240px',
				imgType: 'jpg',
				media: '(max-width: 739px)',
			},
			{
				gridId: 'placeholder_1x1',
				srcSizes: [802, 500],
				sizes: '200px',
				imgType: 'jpg',
				media: '(max-width: 979px)',
			},
			{
				gridId: 'placeholder_4x3',
				srcSizes: [962, 500],
				sizes: '240px',
				imgType: 'jpg',
				media: '(min-width: 980px)',
			},
		]}
		fallback="placeholder_4x3"
		fallbackSize={240}
		altText=""
	/>
  }
  cssOverrides={css\`
    background-color: #052962;
    color: #fff;
  \`}
/>
			`.trim(),
		},
	},
};

/**
 * Light-theme variant.  Override the container colours via \`cssOverrides\`
 * whenever the page palette differs from the dark Guardian blue default.
 */
export function LightTheme(): JSX.Element {
	return (
		<HeroContainer
			imageSlot={<SampleImage />}
			contentSlot={<SampleContent />}
			cssOverrides={css`
				background-color: #f6f6f6;
				color: #121212;
			`}
		/>
	);
}
