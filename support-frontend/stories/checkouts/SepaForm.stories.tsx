import { css } from '@emotion/react';
import { Column, Columns } from '@guardian/source-react-components';
import React, { useState } from 'react';
import type { SepaFormProps } from 'components/sepaForm/SepaForm';
import { SepaForm } from 'components/sepaForm/SepaForm';
import { withCenterAlignment } from '../../.storybook/decorators/withCenterAlignment';
import { withSourceReset } from '../../.storybook/decorators/withSourceReset';

export default {
	title: 'Checkouts/Sepa Form',
	component: SepaForm,
	argTypes: {},
	decorators: [
		(Story: React.FC): JSX.Element => (
			<Columns
				collapseUntil="tablet"
				cssOverrides={css`
					width: 100%;
				`}
			>
				<Column span={[1, 8, 7]}>
					<Story />
				</Column>
			</Columns>
		),
		withCenterAlignment,
		withSourceReset,
	],
	parameters: {
		docs: {
			description: {
				component: `The SEPA Direct Debit payment method is offered to users within the Europe region.`,
			},
		},
	},
};

function Template(args: SepaFormProps) {
	const [iban, setIban] = useState(args.iban ?? '');
	const [accountHolderName, setAccountHolderName] = useState(
		args.accountHolderName ?? '',
	);
	const [addressStreetName, setAddressStreetName] = useState(
		args.addressStreetName ?? '',
	);
	const [addressCountry, setAddressCountry] = useState(
		args.addressCountry ?? '',
	);

	return (
		<SepaForm
			iban={iban}
			accountHolderName={accountHolderName}
			addressStreetName={addressStreetName}
			addressCountry={addressCountry}
			updateIban={(iban: string) => {
				setIban(iban);
			}}
			updateAccountHolderName={(accountHolderName: string) => {
				setAccountHolderName(accountHolderName);
			}}
			updateAddressStreetName={(addressStreetName: string) => {
				setAddressStreetName(addressStreetName);
			}}
			updateAddressCountry={(addressCountry: string) => {
				setAddressCountry(addressCountry);
			}}
			errors={args.errors}
		/>
	);
}

Template.args = {} as Record<string, unknown>;

export const Default = Template.bind({});

Default.args = {
	iban: '',
	accountHolderName: '',
	addressStreetName: '',
	addressCountry: '',
	errors: {},
};

export const WithErrors = Template.bind({});

WithErrors.args = {
	iban: '',
	accountHolderName: '',
	addressStreetName: '',
	addressCountry: '',
	errors: {
		accountHolderName: ['Please provide your account holder name'],
		iban: ['Please enter a valid IBAN'],
	},
};
