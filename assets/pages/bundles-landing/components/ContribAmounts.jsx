// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import RadioToggle from 'components/radioToggle/radioToggle';
import NumberInput from 'components/numberInput/numberInput';
import InfoText from 'components/infoText/infoText';
import {
  changeContribAmount,
  changeContribAmountRecurring,
  changeContribAmountOneOff,
} from '../actions/bundlesLandingActions';


// ----- Setup ----- //

const amountToggles = {
  recurring: {
    name: 'contributions-amount-recurring-toggle',
    radios: [
      {
        value: '5',
        text: '£5',
      },
      {
        value: '10',
        text: '£10',
      },
      {
        value: '20',
        text: '£20',
      },
    ],
  },
  oneOff: {
    name: 'contributions-amount-oneoff-toggle',
    radios: [
      {
        value: '25',
        text: '£25',
      },
      {
        value: '50',
        text: '£50',
      },
      {
        value: '100',
        text: '£100',
      },
      {
        value: '250',
        text: '£250',
      },
    ],
  },
};

const contribErrors = {
  tooLittleRecurring: 'Please enter at least £5',
  tooLittleOneOff: 'Please enter at least £1',
  tooMuch: 'We are presently only able to accept contributions of £2000 or less',
  noEntry: 'Please enter a numeric amount',
};


// ----- Functions ----- //

function errorMessage(error) {

  if (error) {
    return <InfoText text={contribErrors[error]} />;
  }

  return null;

}

function getAttrs(props) {

  const contrType = props.contribType === 'RECURRING' ? 'recurring' : 'oneOff';
  const userDefined = props.contrib.oneOff.userDefined;
  let toggleAction;

  if (props.contribType === 'RECURRING') {
    toggleAction = props.predefinedRecurringAmount;
  } else {
    toggleAction = props.predefinedOneOffAmount;
  }

  return {
    toggleAction,
    checked: !userDefined ? props.contrib[contrType].amount : null,
    toggles: amountToggles[contrType],
    selected: props.contrib[contrType].userDefined,
  };

}


// ----- Component ----- //

function ContribAmounts(props) {

  const attrs = getAttrs(props);

  return (
    <div className="contrib-amounts">
      <RadioToggle
        {...attrs.toggles}
        toggleAction={attrs.toggleAction}
        checked={attrs.checked}
      />
      <NumberInput
        onFocus={props.userDefinedAmount}
        onInput={props.userDefinedAmount}
        selected={attrs.selected}
        placeholder="Other Amount (£)"
      />
      {errorMessage(props.contribError)}
    </div>
  );

}


// ----- Proptypes ----- //

ContribAmounts.propTypes = {
  contribError: React.PropTypes.string.isRequired,
  userDefinedAmount: React.PropTypes.func.isRequired,
};


// ----- Map State/Props ----- //

function mapStateToProps(state) {

  return {
    contrib: state.contribution.amount,
    contribType: state.contribution.type,
    contribError: state.contribution.error,
  };

}

function mapDispatchToProps(dispatch) {

  return {
    predefinedRecurringAmount: (amount) => {
      dispatch(changeContribAmountRecurring({ amount, userDefined: false }));
    },
    predefinedOneOffAmount: (amount) => {
      dispatch(changeContribAmountOneOff({ amount, userDefined: false }));
    },
    userDefinedAmount: (amount) => {
      dispatch(changeContribAmount({ amount, userDefined: true }));
    },
  };

}


// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(ContribAmounts);
