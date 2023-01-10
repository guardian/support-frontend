import { guardianFonts } from 'stylesheets/emotion/fonts';
import { reset } from 'stylesheets/emotion/reset';

// Emotion's built-in Global component does not work correctly when using renderToString in a browser environment
// as we do to pre-render pages (using JSDOM). This component inserts the required global styles for pre-rendered pages.
// Cf. https://github.com/emotion-js/emotion/issues/2691
export function PrerenderGlobalStyles(): JSX.Element {
	return <style>{`${reset.styles}${guardianFonts.styles}`}</style>;
}
