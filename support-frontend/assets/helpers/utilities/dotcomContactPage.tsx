import { isSwitchOn } from 'helpers/globalsAndSwitches/globals';
import { guardianContactUsLink } from 'helpers/legal';

function ContactPageLink(props: { linkText: string }) {
	return <a href={guardianContactUsLink}>{props.linkText}</a>;
}

const useDotcomContactPage = (): boolean =>
	isSwitchOn('subscriptionsSwitches.useDotcomContactPage');

export { ContactPageLink, useDotcomContactPage };
