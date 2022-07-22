import { css, ThemeProvider } from '@emotion/react';
import { space } from '@guardian/source-foundations';
import {
	Button,
	buttonThemeReaderRevenueBrandAlt,
	Option,
	Select,
	TextInput,
} from '@guardian/source-react-components';
import React from 'react';
import type { PostcodeFinderResult } from 'components/subscriptionCheckouts/address/postcodeLookup';

// ---- Component ---- //

interface PostCodeFinderProps {
	postcode: string;
	isLoading: boolean;
	results?: PostcodeFinderResult[];
	error?: string;
	onPostcodeUpdate: (postcode: string) => void;
	onPostcodeError: (error: string) => void;
	onFindAddress: (postcode: string) => void;
	onAddressSelected: (result: PostcodeFinderResult) => void;
}

export function PostcodeFinder({
	postcode,
	isLoading,
	results,
	error,
	onPostcodeUpdate,
	onPostcodeError,
	onFindAddress,
	onAddressSelected,
}: PostCodeFinderProps): JSX.Element {
	function handleSubmit() {
		if (isLoading) {
			return;
		}

		if (postcode.trim() === '') {
			onPostcodeError('Please enter a postcode');
			return;
		}

		onFindAddress(postcode);
	}

	return (
		<div css={styles.container}>
			<div css={styles.inputAndButtonContainer}>
				<div>
					<TextInput
						label="Postcode"
						value={postcode}
						error={error}
						onChange={(e) => {
							onPostcodeUpdate(e.target.value);
						}}
						onKeyPress={(e) => {
							if (e.key && e.key === 'Enter') {
								e.preventDefault();
								handleSubmit();
							}
						}}
						data-qm-masking="blocklist"
						width={10}
					/>
				</div>

				{!isLoading && (
					<div css={styles.buttonContainer}>
						<ThemeProvider theme={buttonThemeReaderRevenueBrandAlt}>
							<Button priority="tertiary" type="button" onClick={handleSubmit}>
								Find address
							</Button>
						</ThemeProvider>
					</div>
				)}
			</div>

			{results && results.length > 0 && (
				<div css={styles.addressSelectorContainer}>
					<AddressSelector
						results={results}
						onAddressSelected={onAddressSelected}
					/>
				</div>
			)}
		</div>
	);
}

// ---- Helper component ---- //

interface AddressSelectorProps {
	results: PostcodeFinderResult[];
	onAddressSelected: (address: PostcodeFinderResult) => void;
}

function AddressSelector({ results, onAddressSelected }: AddressSelectorProps) {
	function handleAddressSelected(e: React.ChangeEvent<HTMLSelectElement>) {
		const resultIndex = Number.parseInt(e.currentTarget.value);
		if (results[resultIndex]) {
			onAddressSelected(results[resultIndex]);
		}
	}

	return (
		<Select
			onChange={handleAddressSelected}
			label={`${results.length} ${pluralisedAddress(results.length)} found`}
		>
			<Option value={''}>Select an address</Option>
			<>
				{results.map((result, index) => (
					<Option key={result.lineOne} value={index}>
						{addressOption(result)}
					</Option>
				))}
			</>
		</Select>
	);
}

// ---- Helper functions ---- //

function pluralisedAddress(numAddresses: number) {
	return numAddresses === 1 ? 'address' : 'addresses';
}

function addressOption(address: PostcodeFinderResult) {
	if (address.lineTwo) {
		return [address.lineOne, address.lineTwo].join(', ');
	}
	return address.lineOne ?? '';
}

// ---- Styles ---- //

const styles = {
	container: css`
		margin-bottom: ${space[6]}px;
	`,
	inputAndButtonContainer: css`
		display: flex;
		align-items: flex-end;
	`,
	buttonContainer: css`
		margin-left: ${space[3]}px;
	`,
	addressSelectorContainer: css`
		margin-top: ${space[6]}px;
	`,
};
