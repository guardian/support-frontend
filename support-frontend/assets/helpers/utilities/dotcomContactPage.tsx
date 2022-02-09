import { isSwitchOn } from 'helpers/globalsAndSwitches/globals';

const ContactPageLink = (props: { linkText: string }) => (
	<a href="https://www.theguardian.com/help/contact-us">{props.linkText}</a>
);

const useDotcomContactPage = (): boolean =>
	isSwitchOn('subscriptionsSwitches.useDotcomContactPage');

export { ContactPageLink, useDotcomContactPage };
