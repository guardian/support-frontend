// `support-frontend/assets/components/subscriptionCheckouts/address/postcodeFinder.tsx`
import { css } from '@emotion/react';
import { space } from '@guardian/source/foundations';
import { Option, Select, TextInput } from '@guardian/source/react-components';
import React, { useState } from 'react';
import type { PostcodeFinderResult } from 'components/subscriptionCheckouts/address/postcodeLookup';
import { addressLookupUrl } from '../../../helpers/urls/routes';
import { RegularPaymentRequestAddress } from '../../../helpers/forms/paymentIntegrations/readerRevenueApis';

interface PostCodeFinderProps {
	postcode: string;
	isLoading: boolean;
	results?: PostcodeFinderResult[];
	error?: string;
	onPostcodeUpdate: (postcode: string) => void;
	onPostcodeError: (error: string) => void;
	onFindAddress: (postcode: string) => void;
	onAddressSelected: (result: PostcodeFinderResult) => void;
	onLookupResultSelected?: (lookupResult: AddressLookupResult) => void; // new callback
}

export type AddressLookupResult = {
	title: string;
	address: RegularPaymentRequestAddress;
};

async function doLookup(searchTerm: string) {
	const response = await fetch(addressLookupUrl(searchTerm), { method: 'GET' });
	if (response.ok) {
		const data = await response.json();
		return data as AddressLookupResult[];
	}
	throw new Error('Error fetching address data');
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
	onLookupResultSelected,
}: PostCodeFinderProps): JSX.Element {
	const [suggestions, setSuggestions] = useState<AddressLookupResult[]>([]);
	const [showSuggestions, setShowSuggestions] = useState(false);

	async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const value = e.target.value;
		onPostcodeUpdate(value);
		if (value.trim().length >= 3) {
			try {
				const lookup = await doLookup(value);
				setSuggestions(lookup);
				setShowSuggestions(lookup.length > 0);
			} catch {
				setSuggestions([]);
				setShowSuggestions(false);
			}
		} else {
			setSuggestions([]);
			setShowSuggestions(false);
		}
	}

	function handleSubmit() {
		if (isLoading) return;
		if (postcode.trim() === '') {
			onPostcodeError('Please enter a postcode');
			return;
		}
		onFindAddress(postcode);
		setShowSuggestions(false);
	}

	function handleSuggestionClick(lookupResult: AddressLookupResult) {
		onPostcodeUpdate(lookupResult.address.postCode ?? '');
		onLookupResultSelected?.(lookupResult);
		setShowSuggestions(false);
	}

	return (
		<div css={styles.container}>
			<div css={styles.inputWrapper}>
				<TextInput
					label="Start typing your address"
					value={postcode}
					error={error}
					onChange={handleChange}
					onKeyPress={(e) => {
						if (e.key === 'Enter') {
							e.preventDefault();
							handleSubmit();
						}
					}}
					data-qm-masking="blocklist"
					onBlur={() => {
						// Slight delay to allow click selection before hiding
						setTimeout(() => setShowSuggestions(false), 150);
					}}
					onFocus={() => {
						if (suggestions.length > 0) setShowSuggestions(true);
					}}
				/>
				{showSuggestions && (
					<ul role="listbox" css={styles.suggestions}>
						{suggestions.map((lookupResult, i) => (
							<li key={i} css={styles.suggestionItem}>
								<button
									type="button"
									css={styles.suggestionButton}
									onMouseDown={(e) => e.preventDefault()}
									onClick={() => handleSuggestionClick(lookupResult)}
								>
									{lookupResult.title}
								</button>
							</li>
						))}
					</ul>
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

interface AddressSelectorProps {
	results: PostcodeFinderResult[];
	onAddressSelected: (address: PostcodeFinderResult) => void;
}

function AddressSelector({ results, onAddressSelected }: AddressSelectorProps) {
	function handleAddressSelected(e: React.ChangeEvent<HTMLSelectElement>) {
		const resultIndex = Number.parseInt(e.currentTarget.value);
		const result = results[resultIndex];
		if (result) onAddressSelected(result);
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

function pluralisedAddress(numAddresses: number) {
	return numAddresses === 1 ? 'address' : 'addresses';
}

function addressOption(address: PostcodeFinderResult) {
	if (address.lineTwo) return [address.lineOne, address.lineTwo].join(', ');
	return address.lineOne ?? '';
}

const styles = {
	container: css`
		margin-bottom: ${space[6]}px;
		position: relative;
	`,
	inputWrapper: css`
		position: relative;
		display: inline-block;
	`,
	suggestions: css`
		list-style: none;
		margin: 0;
		padding: 0;
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		z-index: 10;
		background: #fff;
		border: 1px solid #ccc;
		border-top: none;
		max-height: 240px;
		overflow-y: auto;
	`,
	suggestionItem: css`
		margin: 0;
	`,
	suggestionButton: css`
		background: none;
		border: none;
		text-align: left;
		width: 100%;
		padding: ${space[2]}px ${space[3]}px;
		cursor: pointer;
		font: inherit;
		&:hover,
		&:focus {
			background: #f1f1f1;
		}
	`,
	addressSelectorContainer: css`
		margin-top: ${space[6]}px;
	`,
};
