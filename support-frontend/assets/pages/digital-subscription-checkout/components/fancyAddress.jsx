// @flow

import React from 'react';
import { Component } from 'preact';
import { firstError } from 'helpers/subscriptionsForms/validation';
import { sortedOptions } from 'components/forms/customFields/sortedOptions';
import { isPostcodeOptional } from 'components/subscriptionCheckouts/address/addressFieldsStore';
import { withLabel } from 'hocs/withLabel';
import { Input } from 'components/forms/input';
import { asControlled } from 'hocs/asControlled';
import { withError } from 'hocs/withError';
import { compose } from "redux";
import { Select } from 'components/forms/select';
import { canShow } from 'hocs/canShow';
import { countries } from 'helpers/internationalisation/country';

const StaticInputWithLabel = withLabel(Input);
const InputWithLabel = asControlled(StaticInputWithLabel);
const InputWithError = withError(InputWithLabel);
const SelectWithLabel = withLabel(Select);
const gu = {"Id":"GB|RM|B|51451789","DomesticId":"51451789","Language":"ENG","LanguageAlternatives":"ENG","Department":"","Company":"The Guardian Media Group","SubBuilding":"","BuildingNumber":"90","BuildingName":"Kings Place","SecondaryStreet":"","Street":"York Way","Block":"","Neighbourhood":"","District":"","City":"London","Line1":"Kings Place","Line2":"90 York Way","Line3":"","Line4":"","Line5":"","AdminAreaName":"Islington","AdminAreaCode":"","Province":"","ProvinceName":"","ProvinceCode":"","PostalCode":"N1 9GU","CountryName":"United Kingdom","CountryIso2":"GB","CountryIso3":"GBR","CountryIsoNumber":826,"SortingNumber1":"62113","SortingNumber2":"","Barcode":"(N19GU1A0)","POBoxNumber":"","Label":"The Guardian Media Group\nKings Place\n90 York Way\nLONDON\nN1 9GU\nUNITED KINGDOM","Type":"Commercial","DataLevel":"Premise","Field1":"","Field2":"","Field3":"","Field4":"","Field5":"","Field6":"","Field7":"","Field8":"","Field9":"","Field10":"","Field11":"","Field12":"","Field13":"","Field14":"","Field15":"","Field16":"","Field17":"","Field18":"","Field19":"","Field20":"","FormattedLine1":"The Guardian Media Group","FormattedLine2":"Kings Place, 90 York Way","FormattedLine3":"","FormattedLine4":"","FormattedLine5":""};
const ny = {"Id":"US|US|A|V119112259|1B","DomesticId":"V119112259","Language":"ENG","LanguageAlternatives":"ENG","Department":"","Company":"Rosenbluth Intern","SubBuilding":"Bsmt 1B","BuildingNumber":"11","BuildingName":"","SecondaryStreet":"","Street":"Madison Ave","Block":"","Neighbourhood":"","District":"","City":"New York","Line1":"11 Madison Ave Bsmt 1B","Line2":"","Line3":"","Line4":"","Line5":"","AdminAreaName":"New York","AdminAreaCode":"061","Province":"NY","ProvinceName":"New York","ProvinceCode":"NY","PostalCode":"10010-3629","CountryName":"United States","CountryIso2":"US","CountryIso3":"USA","CountryIsoNumber":840,"SortingNumber1":"","SortingNumber2":"","Barcode":"","POBoxNumber":"","Label":"Rosenbluth Intern\n11 Madison Ave Bsmt 1B\nNEW YORK NY 10010-3629\nUNITED STATES","Type":"Commercial","DataLevel":"Range","Field1":"","Field2":"","Field3":"","Field4":"","Field5":"","Field6":"","Field7":"","Field8":"","Field9":"","Field10":"","Field11":"","Field12":"","Field13":"","Field14":"","Field15":"","Field16":"","Field17":"","Field18":"","Field19":"","Field20":"","FormattedLine1":"Rosenbluth Intern","FormattedLine2":"11 Madison Ave Bsmt 1B","FormattedLine3":"","FormattedLine4":"","FormattedLine5":""};
const variations = [gu];
export default class FancyAddress extends Component {
  scope = 'fancy';
  componentDidMount(): void {
    const fields = [
      { element: `${this.scope}-search`, field: "" },
      { element: `${this.scope}-line1`, field: "Line1" },
      { element: `${this.scope}-line2`, field: "Line2", mode: pca.fieldMode.POPULATE },
      { element: `${this.scope}-city`, field: "City", mode: pca.fieldMode.POPULATE },
      { element: `${this.scope}-postcode`, field: "PostalCode" },
      { element: `${this.scope}-country`, field: "CountryName", mode: pca.fieldMode.COUNTRY }
    ];
    const options = { key: 'KU38-EK85-GN78-YA78' };
    const control = new pca.Address(fields, options);
    control.listen("populate", function(address, variations) {
      console.log(address);
      console.log(variations);
    });
  }
  render() {
    const scope = this.scope;
    return (
      <div>
        <StaticInputWithLabel
          id={`${scope}-search`}
          label={"Search"}
        />
        <SelectWithLabel
          id={`${scope}-country`}
          label="Select Country"
        >
          <option value="">--</option>
          {sortedOptions(countries)}
        </SelectWithLabel>
        <InputWithError
          id={`${scope}-line1`}
          label="Address Line 1"
          type="text"
        />
        <InputWithError
          id={`${scope}-line2`}
          label="Address Line 2"
          optional
          type="text"
        />
        <InputWithError
          id={`${scope}-city`}
          label="Town/City"
          type="text"
        />

        <InputWithError
          id={`${scope}-postcode`}
          label={'Postcode'}
          type="text"
        />
      </div>
    );
  }
}
