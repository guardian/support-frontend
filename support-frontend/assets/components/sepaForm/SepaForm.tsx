import { css } from '@emotion/react';
import type { Country } from '@guardian/consent-management-platform/dist/types/countries';
import { headline, space } from '@guardian/source-foundations';
import {
	Option as OptionForSelect,
	Select,
	Stack,
	TextInput,
} from '@guardian/source-react-components';
import { countries } from 'helpers/internationalisation/country';
import type { SepaState } from 'helpers/redux/checkout/payment/sepa/state';
import { sortedOptions } from '../forms/customFields/sortedOptions';

// -- Styles -- //

const headerStyles = css`
	${headline.xxxsmall({
		fontWeight: 'bold',
	})}
`;
const fieldsContainerStyles = css`
	margin-top: ${space[4]}px;
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
	errors: SepaState['errors'];
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
	errors,
}: SepaFormProps): JSX.Element {
	return (
		<div>
			<h3 css={headerStyles}>Your account details</h3>
			<Stack cssOverrides={fieldsContainerStyles} space={3}>
				<div>
					<TextInput
						id="accountHolderName"
						data-testid="sepa-account-holder-name-input"
						data-qm-masking="blocklist"
						optional={false}
						hideLabel={false}
						label="Bank account holder name"
						maxLength={40}
						value={accountHolderName ?? undefined}
						error={errors.accountHolderName?.[0]}
						onChange={(e) => updateAccountHolderName(e.target.value)}
					/>
				</div>
				<div>
					<TextInput
						id="iban"
						data-testid="sepa-account-number"
						data-qm-masking="blocklist"
						optional={false}
						hideLabel={false}
						label="IBAN"
						pattern="[0-9A-Z ]*"
						minLength={6}
						maxLength={34}
						value={iban ?? undefined}
						error={errors.iban?.[0]}
						onChange={(e) => updateIban(e.target.value)}
					/>
				</div>
				<div>
					<TextInput
						id="streetName"
						data-testid="sepa-address-line-one"
						data-qm-masking="blocklist"
						optional={false}
						hideLabel={false}
						label="Address Line 1"
						value={addressStreetName ?? undefined}
						error={errors.streetName?.[0]}
						onChange={(e) => updateAddressStreetName(e.target.value)}
					/>
				</div>
				<div>
					<Select
						id="country"
						data-testid="sepa-country"
						data-qm-masking="blocklist"
						optional={false}
						hideLabel={false}
						label="Country"
						value={addressCountry ?? undefined}
						error={errors.country?.[0]}
						onChange={(e) => updateAddressCountry(e.target.value)}
					>
						<OptionForSelect value="">Select a country</OptionForSelect>
						{sortedOptions(countries)}
					</Select>
				</div>
			</Stack>
		</div>
	);
}
