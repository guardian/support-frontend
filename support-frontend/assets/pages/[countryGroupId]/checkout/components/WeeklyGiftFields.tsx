import type { IsoCountry } from '@modules/internationalisation/country';
import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import { useState } from 'react';
import { AddressFields } from 'components/subscriptionCheckouts/address/addressFields';
import type {
	PostcodeFinderResult} from 'components/subscriptionCheckouts/address/postcodeLookup';
import {
	findAddressesForPostcode
} from 'components/subscriptionCheckouts/address/postcodeLookup';
import type { ProductDescription } from 'helpers/productCatalog';
import type { AddressFormFieldError } from 'helpers/redux/checkout/address/state';
import { FormSection, Legend } from 'pages/[countryGroupId]/components/form';
import { CheckoutDivider } from 'pages/supporter-plus-landing/components/checkoutDivider';
import { getWeeklyDays } from 'pages/weekly-subscription-checkout/helpers/deliveryDays';
import { useStateWithCheckoutSession } from '../hooks/useStateWithCheckoutSession';
import { PersonalDetailsFields } from './PersonalDetailsFields';
import { WeeklyDeliveryDates } from './WeeklyDeliveryDates';

type WeeklyGiftFieldsProps = {
	countryId: IsoCountry;
	productDescription: ProductDescription;
	countryGroupId: CountryGroupId;
};

export function WeeklyGiftFields({
	countryId,
	productDescription,
	countryGroupId,
}: WeeklyGiftFieldsProps) {
	/** Gift recipient details */
	// Session storage unavailable yet, so use state
	const [recipientFirstName, setRecipientFirstName] =
		useStateWithCheckoutSession<string>(undefined, '');
	const [recipientLastName, setRecipientLastName] =
		useStateWithCheckoutSession<string>(undefined, '');
	const [recipientEmail, setRecipientEmail] =
		useStateWithCheckoutSession<string>(undefined, '');

	/** Gift recipient address */
	const [recipientPostcode, setRecipientPostcode] =
		useStateWithCheckoutSession<string>(undefined, '');
	const [recipientLineOne, setRecipientLineOne] =
		useStateWithCheckoutSession<string>(undefined, '');
	const [recipientLineTwo, setRecipientLineTwo] =
		useStateWithCheckoutSession<string>(undefined, '');
	const [recipientCity, setRecipientCity] = useStateWithCheckoutSession<string>(
		undefined,
		'',
	);
	const [recipientState, setRecipientState] =
		useStateWithCheckoutSession<string>(undefined, '');
	const [recipientPostcodeStateResults, setRecipientPostcodeStateResults] =
		useState<PostcodeFinderResult[]>([]);
	const [recipientPostcodeStateLoading, setRecipientPostcodeStateLoading] =
		useState(false);
	const [recipientCountry, setRecipientCountry] =
		useStateWithCheckoutSession<IsoCountry>(undefined, countryId);
	const [recipientAddressErrors, setRecipientAddressErrors] = useState<
		AddressFormFieldError[]
	>([]);

	/** Delivery Instructions */
	const weeklyDeliveryDates = getWeeklyDays();
	const [weeklyDeliveryDate, setWeeklyDeliveryDate] = useState<Date>(
		weeklyDeliveryDates[0] as Date,
	);

	return (
		<>
			<FormSection>
				<Legend>1. Gift recipient's details</Legend>

				<PersonalDetailsFields
					isEmailAddressReadOnly={false}
					firstName={recipientFirstName}
					setFirstName={(recipientFirstName) =>
						setRecipientFirstName(recipientFirstName)
					}
					lastName={recipientLastName}
					setLastName={(recipientLastName) =>
						setRecipientLastName(recipientLastName)
					}
					email={recipientEmail}
					setEmail={(recipientEmail) => setRecipientEmail(recipientEmail)}
					isSignedIn={false}
				/>
			</FormSection>
			<CheckoutDivider spacing="loose" />
			<FormSection>
				<Legend>2. Gift delivery date</Legend>
				<WeeklyDeliveryDates
					weeklyDeliveryDates={weeklyDeliveryDates}
					weeklyDeliveryDateSelected={weeklyDeliveryDate}
					setWeeklyDeliveryDate={(weeklyDeliveryDate) => {
						setWeeklyDeliveryDate(weeklyDeliveryDate);
					}}
				/>
			</FormSection>
			<CheckoutDivider spacing="loose" />
			<FormSection>
				{productDescription.deliverableTo && (
					<>
						<fieldset>
							<Legend>3. Gift recipient's address</Legend>
							<AddressFields
								scope={'recipient'}
								lineOne={recipientLineOne}
								lineTwo={recipientLineTwo}
								city={recipientCity}
								country={recipientCountry}
								state={recipientState}
								postCode={recipientPostcode}
								countryGroupId={countryGroupId}
								countries={productDescription.deliverableTo}
								errors={recipientAddressErrors}
								postcodeState={{
									results: recipientPostcodeStateResults,
									isLoading: recipientPostcodeStateLoading,
									postcode: recipientPostcode,
									error: '',
								}}
								setLineOne={(lineOne) => {
									setRecipientLineOne(lineOne);
								}}
								setLineTwo={(lineTwo) => {
									setRecipientLineTwo(lineTwo);
								}}
								setTownCity={(city) => {
									setRecipientCity(city);
								}}
								setState={(state) => {
									setRecipientState(state);
								}}
								setPostcode={(postcode) => {
									setRecipientPostcode(postcode);
								}}
								setCountry={(country) => {
									setRecipientCountry(country);
								}}
								setPostcodeForFinder={() => {
									// no-op
								}}
								setPostcodeErrorForFinder={() => {
									// no-op
								}}
								setErrors={(errors) => {
									setRecipientAddressErrors(errors);
								}}
								onFindAddress={(postcode) => {
									setRecipientPostcodeStateLoading(true);
									void findAddressesForPostcode(postcode).then((results) => {
										setRecipientPostcodeStateLoading(false);
										setRecipientPostcodeStateResults(results);
									});
								}}
							/>
						</fieldset>
					</>
				)}
			</FormSection>
		</>
	);
}
