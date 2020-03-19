// @flow

import { isSwitchOn } from 'helpers/globals';

const ContactPageLink = () => <a href="https://www.theguardian.com/help/contact-us">contact us</a>;

const useDotcomContactPage = (): boolean => isSwitchOn('useDotcomContactPage');


export { ContactPageLink, useDotcomContactPage };
