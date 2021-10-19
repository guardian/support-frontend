import { $Call } from 'utility-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TextInput } from '@guardian/src-text-input';
import { css } from '@emotion/core';
import { space } from '@guardian/src-foundations';
import type { FormError } from 'helpers/subscriptionsForms/validation';
import { firstError } from 'helpers/subscriptionsForms/validation';
import { sortedOptions } from 'components/forms/customFields/sortedOptions';
import { Select, Option as OptionForSelect } from '@guardian/src-select';
import { withStore as postcodeFinderWithStore } from 'components/subscriptionCheckouts/address/postcodeFinder';
import type { PostcodeFinderState } from 'components/subscriptionCheckouts/address/postcodeFinderStore';
import 'components/subscriptionCheckouts/address/postcodeFinderStore';
import type { AddressType } from 'helpers/subscriptionsForms/addressType';
import 'helpers/subscriptionsForms/addressType';
import type {
	ActionCreators as AddressActionCreators,
	FormField,
	FormFields,
	State as AddressState,
} from 'components/subscriptionCheckouts/address/addressFieldsStore';
import {
	addressActionCreatorsFor,
	getFormFields,
	getPostcodeForm,
	getStateFormErrors,
	isPostcodeOptional,
} from 'components/subscriptionCheckouts/address/addressFieldsStore';
import { canShow } from 'hocs/canShow';
import type { Option } from 'helpers/types/option';
import type { IsoCountry } from 'helpers/internationalisation/country';
import {
	auStates,
	caStates,
	usStates,
} from 'helpers/internationalisation/country';
type StatePropTypes<GlobalState> = FormFields & {
	countries: Record<string, string>;
	scope: AddressType;
	traverseState: (arg0: GlobalState) => AddressState;
	formErrors: FormError<FormField>[];
};
type PropTypes<GlobalState> = AddressActionCreators &
	StatePropTypes<GlobalState>;
const marginBottom = css`
	margin-bottom: ${space[6]}px;
`;
const MaybeSelect = canShow(Select);
const MaybeInput = canShow(TextInput);

class AddressFields<GlobalState> extends Component<PropTypes<GlobalState>> {
	static shouldShowStateDropdown(country: Option<IsoCountry>): boolean {
		return country === 'US' || country === 'CA' || country === 'AU';
	}

	static shouldShowStateInput(country: Option<IsoCountry>): boolean {
		return country !== 'GB' && !AddressFields.shouldShowStateDropdown(country);
	}

	static statesForCountry(country: Option<IsoCountry>): React.ReactNode {
		switch (country) {
			case 'US':
				return sortedOptions(usStates);

			case 'CA':
				return sortedOptions(caStates);

			case 'AU':
				return sortedOptions(auStates);

			default:
				return null;
		}
	}

	constructor(props: PropTypes<GlobalState>) {
		super(props);
		this.regeneratePostcodeFinder();
	}

	componentDidUpdate(prevProps: PropTypes<GlobalState>) {
		if (prevProps.scope !== this.props.scope) {
			this.regeneratePostcodeFinder();
		}
	}

	regeneratePostcodeFinder() {
		/*
    this is done to prevent preact from re-rendering the whole component on each keystroke sadface
    */
		const { scope, traverseState } = this.props;
		this.PostcodeFinder = postcodeFinderWithStore(scope, (state) =>
			getPostcodeForm(traverseState(state)),
		);
	}

	PostcodeFinder: $Call<
		typeof postcodeFinderWithStore,
		AddressType,
		() => PostcodeFinderState
	>;

	render() {
		const { scope, ...props } = this.props;
		const { PostcodeFinder } = this;
		return (
			<div>
				<Select
					css={marginBottom}
					id={`${scope}-country`}
					label="Country"
					value={props.country}
					onChange={(e) => props.setCountry(e.target.value)}
					error={firstError('country', props.formErrors)}
				>
					<OptionForSelect value="">Select a country</OptionForSelect>
					{sortedOptions(props.countries)}
				</Select>
				{props.country === 'GB' ? (
					<PostcodeFinder
						id={`${scope}-postcode`}
						onPostcodeUpdate={props.setPostcode}
						onAddressUpdate={({ lineOne, lineTwo, city }) => {
							if (lineOne) {
								props.setAddressLineOne(lineOne);
							}

							if (lineTwo) {
								props.setAddressLineTwo(lineTwo);
							}

							if (city) {
								props.setTownCity(city);
							}
						}}
					/>
				) : null}
				<TextInput
					css={marginBottom}
					id={`${scope}-lineOne`}
					label="Address Line 1"
					type="text"
					value={props.lineOne}
					onChange={(e) => props.setAddressLineOne(e.target.value)}
					error={firstError('lineOne', props.formErrors)}
				/>
				<TextInput
					css={marginBottom}
					id={`${scope}-lineTwo`}
					label="Address Line 2"
					optional
					type="text"
					value={props.lineTwo}
					onChange={(e) => props.setAddressLineTwo(e.target.value)}
					error={firstError('lineTwo', props.formErrors)}
				/>
				<TextInput
					css={marginBottom}
					id={`${scope}-city`}
					label="Town/City"
					type="text"
					maxlength={40}
					value={props.city}
					onChange={(e) => props.setTownCity(e.target.value)}
					error={firstError('city', props.formErrors)}
				/>
				<MaybeSelect
					css={marginBottom}
					id={`${scope}-stateProvince`}
					label={props.country === 'CA' ? 'Province/Territory' : 'State'}
					value={props.state}
					onChange={(e) => props.setState(e.target.value)}
					error={firstError('state', props.formErrors)}
					isShown={AddressFields.shouldShowStateDropdown(props.country)}
				>
					<OptionForSelect value="">{`Select a ${
						props.country === 'CA' ? 'province/territory' : 'state'
					}`}</OptionForSelect>
					{AddressFields.statesForCountry(props.country)}
				</MaybeSelect>
				<MaybeInput
					css={marginBottom}
					id={`${scope}-stateProvince`}
					label="State"
					value={props.state}
					onChange={(e) => props.setState(e.target.value)}
					error={firstError('state', props.formErrors)}
					optional
					isShown={AddressFields.shouldShowStateInput(props.country)}
				/>
				<TextInput
					css={marginBottom}
					id={`${scope}-postcode`}
					label={props.country === 'US' ? 'ZIP code' : 'Postcode'}
					type="text"
					optional={isPostcodeOptional(props.country)}
					value={props.postCode}
					onChange={(e) => props.setPostcode(e.target.value)}
					error={firstError('postCode', props.formErrors)}
				/>
			</div>
		);
	}
}

export const withStore = (
	countries: Record<string, string>,
	scope: AddressType,
	traverseState: (arg0: GlobalState) => AddressState,
) =>
	connect(
		(state: GlobalState) => ({
			countries,
			...getFormFields(traverseState(state)),
			formErrors: getStateFormErrors(traverseState(state)) || [],
			traverseState,
			scope,
		}),
		addressActionCreatorsFor(scope),
	)(AddressFields);
