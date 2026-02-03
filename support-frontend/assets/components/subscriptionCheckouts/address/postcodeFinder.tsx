import { css } from '@emotion/react';
import { palette, space, textSans17 } from '@guardian/source/foundations';
import {
	Button,
	Option,
	Select,
	TextInput,
	themeButtonReaderRevenueBrandAlt,
} from '@guardian/source/react-components';
import type React from 'react';
import type { PostcodeFinderResult } from 'components/subscriptionCheckouts/address/postcodeLookup';

// ---- Component ---- //

interface PostCodeFinderProps {
	postcode: string;
	isLoading: boolean;
	results?: PostcodeFinderResult[];
	error?: string;
	onPostcodeUpdate: (postcode: string) => void;
	onPostcodeLookupError: (error: string) => void;
	postcodeLookupError: string | null;
	onFindAddress: (postcode: string) => void;
	onAddressSelected: (result: PostcodeFinderResult) => void;
}

export function PostcodeFinder({
	postcode,
	isLoading,
	results,
	error,
	onPostcodeUpdate,
	onPostcodeLookupError,
	postcodeLookupError,
	onFindAddress,
	onAddressSelected,
}: PostCodeFinderProps): JSX.Element {
	function handleSubmit() {
		if (isLoading) {
			return;
		}

		if (postcode.trim() === '') {
			onPostcodeLookupError('Please enter a postcode');
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
						<Button
							priority="tertiary"
							type="button"
							onClick={handleSubmit}
							theme={themeButtonReaderRevenueBrandAlt}
						>
							Find address
						</Button>
					</div>
				)}
			</div>

			{postcodeLookupError && (
				<div css={styles.errorContainer} role="alert">
					{postcodeLookupError}
				</div>
			)}

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
		const result = results[resultIndex];
		if (result) {
			onAddressSelected(result);
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
					<Option
						key={`${result.lineOne ?? ''}/${result.lineTwo ?? ''}`}
						value={index}
					>
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
	errorContainer: css`
		${textSans17};
		margin-top: ${space[4]}px;
		color: ${palette.error[400]};
	`,
};
