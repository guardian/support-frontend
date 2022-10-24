import { css } from '@emotion/react';
import type { Country } from '@guardian/consent-management-platform/dist/types/countries';
import { headline, space } from '@guardian/source-foundations';
import {
	Option as OptionForSelect,
	Select,
	TextInput,
} from '@guardian/source-react-components';
import { countries } from 'helpers/internationalisation/country';
import { sortedOptions } from '../forms/customFields/sortedOptions';

// -- Styles -- //
const containerStyles = css`
	padding-top: ${space[5]}px;
`;
const headerStyles = css`
	${headline.xxxsmall({
		fontWeight: 'bold',
	})}
`;
const fieldsContainerStyles = css`
	margin-top: ${space[4]}px;
	> * + * {
		margin-top: ${space[3]}px;
	}
`;

// -- Component -- //
export type SepaFormProps = {
	iban?: string;
	accountHolderName?: string;
	addressStreetName?: string;
	addressCountry?: Country;
	updateIban: (iban: string) => void;
	updateAccountHolderName: (accountHolderName: string) => void;
	updateAddressStreetName: (addressStreetName: string) => void;
	updateAddressCountry: (addressCountry: Country) => void;
};

export function SepaForm({
	iban,
	accountHolderName,
	addressStreetName,
	addressCountry,
	updateAddressStreetName,
	updateAddressCountry,
	updateIban,
	updateAccountHolderName,
}: SepaFormProps): JSX.Element {
	return (
		<div css={containerStyles}>
			<h3 css={headerStyles}>Your account details</h3>

			<div css={fieldsContainerStyles}>
				<div>
					<TextInput
						id="sepa-account-holder-name-input"
						data-testid="sepa-account-holder-name-input"
						data-qm-masking="blocklist"
						optional={false}
						hideLabel={false}
						label="Bank account holder name"
						maxLength={40}
						value={accountHolderName ?? undefined}
						onChange={(e) => updateAccountHolderName(e.target.value)}
					/>
				</div>

				<div />

				<div>
					<TextInput
						id="sepa-account-number"
						data-testid="sepa-account-number"
						data-qm-masking="blocklist"
						optional={false}
						hideLabel={false}
						label="IBAN"
						pattern="[0-9A-Z ]*"
						minLength={6}
						maxLength={34}
						value={iban ?? undefined}
						onChange={(e) => updateIban(e.target.value)}
					/>
				</div>

				<div>
					<TextInput
						id="sepa-address-line-one"
						data-testid="sepa-address-line-one"
						data-qm-masking="blocklist"
						optional={false}
						hideLabel={false}
						label="Address Line 1"
						value={addressStreetName ?? undefined}
						onChange={(e) => updateAddressStreetName(e.target.value)}
					/>
				</div>

				<div />

				<div>
					<Select
						id="sepa-country"
						data-testid="sepa-country"
						data-qm-masking="blocklist"
						optional={false}
						hideLabel={false}
						label="Country"
						value={addressCountry ?? undefined}
						onChange={(e) => updateAddressCountry(e.target.value)}
					>
						<OptionForSelect value="">Select a country</OptionForSelect>
						{sortedOptions(countries)}
					</Select>
				</div>
			</div>
		</div>
	);
}
