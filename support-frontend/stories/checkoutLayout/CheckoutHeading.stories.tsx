import type { CheckoutHeadingProps } from 'components/checkoutHeading/checkoutHeading';
import { CheckoutHeading } from 'components/checkoutHeading/checkoutHeading';

export default {
	title: 'Checkout Layout/Checkout Heading',
	component: CheckoutHeading,
};

function Template(args: CheckoutHeadingProps): JSX.Element {
	return (
		<CheckoutHeading heading={args.heading} image={args.image}>
			{args.children}
		</CheckoutHeading>
	);
}

Template.args = {} as Record<string, unknown>;

export const Heading = Template.bind({});

Heading.args = {
	heading: 'Thank you for\u00a0your support',
	children: (
		<p>
			Help protect the Guardian&apos;s independence so we can keep delivering
			quality journalism that&apos;s open for everyone around the world, not
			behind a paywall.
		</p>
	),
	image: (
		<img src="/dev_checkout_image.png" alt="The Guardian apps and website" />
	),
};
