import { connect } from 'react-redux';

function ContributionType(props) {
  return (
    <fieldset className="form__radio-group form__radio-group--tabs form__radio-group--contribution-type">
      <legend className="form__legend form__legend--radio-group">Recurrence</legend>
      <ul className="form__radio-group__list">
        <li className="form__radio-group__item">
          <input id="contributionType-monthly" className="form__radio-group__input" type="radio" name="contributionType" value="MONTHLY" checked={props.contributionType === 'MONTHLY'} />
          <label htmlFor="contributionType-monthly" className="form__radio-group__label">{props.labels.MONTHLY}</label>
        </li>
        <li className="form__radio-group__item">
          <input id="contributionType-oneoff" className="form__radio-group__input" type="radio" name="contributionType" value="ONE_OFF" checked={props.contributionType === 'ONE_OFF'} />
          <label htmlFor="contributionType-oneoff" className="form__radio-group__label">{props.labels.ONE_OFF}</label>
        </li>
      </ul>
    </fieldset>
  );
};

const s2p = state => { contributionType: state.newPaymentUI.contributionType };

const NewContributionType = connect(s2p)(ContributionType);

export { NewContributionType };