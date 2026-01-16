import { setUpTrackingAndConsents } from 'helpers/page/page';
import { renderPage } from 'helpers/rendering/render';
import UnsupportedBrowser from './unsupportedBrowser';

// ----- Page Startup ----- //
setUpTrackingAndConsents({});

// ----- Render ----- //
const content = <UnsupportedBrowser />;
renderPage(content);
