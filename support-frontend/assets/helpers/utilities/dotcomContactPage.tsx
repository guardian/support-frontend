import { isSwitchOn } from 'helpers/globalsAndSwitches/globals';

function ContactPageLink(props: { linkText: string }) {
	return (
		<a href="https://www.theguardian.com/help/contact-us">{props.linkText}</a>
	);
}

const useDotcomContactPage = (): boolean =>
	isSwitchOn('subscriptionsSwitches.useDotcomContactPage');

export { ContactPageLink, useDotcomContactPage };
