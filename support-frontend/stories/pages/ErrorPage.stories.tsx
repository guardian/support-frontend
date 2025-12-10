import type { Meta, StoryObj } from '@storybook/preact-vite';
import { MemoryRouter } from 'react-router-dom';
import type { ErrorPageProps } from 'pages/error/components/errorPage';
import ErrorPage from 'pages/error/components/errorPage';
import { PayPalError } from 'pages/paypal-error/payPalError';
import 'pages/paypal-error/payPalError.scss';

const meta: Meta = {
	title: 'Pages/Error Page',
	component: ErrorPage,
	parameters: {
		docs: {
			description: {
				component:
					'Full-page error experience including header, footer, intro squares and support/home links.',
			},
		},
	},
};

export default meta;

type Story = StoryObj<ErrorPageProps>;

export const Default: Story = {
	render: (args: ErrorPageProps) => (
		<MemoryRouter>
			<ErrorPage {...args} />
		</MemoryRouter>
	),
	args: {
		errorCode: '500',
		headings: ['Something went wrong', 'Please try again shortly'],
		copy: "We're sorry, but something has gone wrong while processing your request.",
		reportLink: true,
		supportLink: true,
	},
	parameters: {
		chromatic: {
			viewports: ['mobile', 'tablet', 'desktop', 'wide'],
		},
	},
};

export const PayPal: Story = {
	render: () => <MemoryRouter>{PayPalError}</MemoryRouter>,
	parameters: {
		chromatic: {
			viewports: ['mobile', 'tablet', 'desktop', 'wide'],
		},
	},
};
