// @flow

// ----- Form Fields ----- //

import { withLabel } from 'hocs/withLabel';
import { Input } from 'components/forms/input';
import { asControlled } from 'hocs/asControlled';
import { withError } from 'hocs/withError';
import { compose } from 'redux';
import { Select } from 'components/forms/select';
import { Fieldset } from 'components/forms/fieldset';
import { canShow } from 'hocs/canShow';

const StaticInputWithLabel = withLabel(Input);
const InputWithLabel = asControlled(StaticInputWithLabel);
const InputWithError = withError(InputWithLabel);
const SelectWithLabel = compose(asControlled, withLabel)(Select);
const SelectWithError = withError(SelectWithLabel);
const SelectWithIsShown = canShow(SelectWithError);
const FieldsetWithError = withError(Fieldset);

export {
  StaticInputWithLabel,
  InputWithLabel,
  InputWithError,
  SelectWithLabel,
  SelectWithError,
  SelectWithIsShown,
  FieldsetWithError,
};
