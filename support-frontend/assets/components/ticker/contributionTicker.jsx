// @flow

// ----- Imports ----- //
import React, { Component } from 'react';
import { classNameWithModifiers } from 'helpers/utilities';
import './contributionTicker.scss';
import type { TickerType } from 'pages/new-contributions-landing/campaigns';

// ---- Types ----- //
type StateTypes = {|
  totalSoFar: number,
  goal: number,
|}

type PropTypes = {|
  // URL to fetch ticker JSON from
  tickerJsonUrl: string,
  onGoalReached: () => void,
  tickerType: TickerType,
|}


// ---- Helpers ----- //

const getInitialTickerValues = (tickerJsonUrl: string): Promise<StateTypes> =>
  fetch(tickerJsonUrl)
    .then(resp => resp.json())
    .then((data) => {
      const totalSoFar = parseInt(data.total, 10);
      const goal = parseInt(data.goal, 10);

      return { totalSoFar, goal };
    });

const percentageTotalAsNegative = (total: number, goal: number) => {
  const percentage = ((total / goal) * 100) - 100;
  return percentage > 0 ? 0 : percentage;
};


// ----- Component ----- //
export default class ContributionTicker extends Component<PropTypes, StateTypes> {

  constructor(props: PropTypes) {
    super(props);

    this.tickerJsonUrl = props.tickerJsonUrl;
    this.onGoalReached = props.onGoalReached;
    this.tickerType = props.tickerType;
    this.classModifiers = [this.tickerType];
    this.increaseTextCounter = this.increaseTextCounter.bind(this);
    this.goalReached = false;

    this.state = {
      totalSoFar: 0,
      goal: 0,
    };

  }

  componentDidMount(): void {
    getInitialTickerValues(this.tickerJsonUrl).then(({ totalSoFar, goal }) => {
      const initialTotal = totalSoFar * 0.8;
      this.count = initialTotal;
      this.totalSoFar = totalSoFar;

      if (totalSoFar >= goal) {
        this.onGoalReached();
        this.classModifiers.push('goal-reached');
        this.goalReached = true;
      }

      this.setState({ totalSoFar: initialTotal, goal });
      window.setTimeout(() => {
        window.requestAnimationFrame(this.increaseTextCounter);
      }, 500);
    });
  }

  onGoalReached: () => void;
  tickerJsonUrl: string;
  totalSoFar: number;
  count = 0;

  increaseTextCounter = () => {
    const { totalSoFar } = this;
    this.count += Math.floor(totalSoFar / 100);

    if (this.count >= this.totalSoFar) {
      this.setState({ totalSoFar: this.totalSoFar });
    } else {
      this.setState({ totalSoFar: this.count });
      window.requestAnimationFrame(this.increaseTextCounter);
    }
  }

  renderContributedSoFar = () => {
    console.log(this.goalReached)
    if (!this.goalReached) {
      return (
        <div className="contributions-landing-ticker__so-far">
          <div className="contributions-landing-ticker__count">${Math.floor(this.state.totalSoFar).toLocaleString()}</div>
          <div className="contributions-landing-ticker__count-label contributions-landing-ticker__label">contributed</div>
        </div>
      );
    }

    if (this.goalReached && this.tickerType === 'unlimited') {
      return (
        <div className="contributions-landing-ticker__so-far">
          <div className="contributions-landing-ticker__count">We&#39;ve met our goal &mdash; thank you</div>
          <div className="contributions-landing-ticker__count-label contributions-landing-ticker__label">Contributions are still being accepted</div>
        </div>
      );
    }

    if (this.goalReached && this.tickerType === 'hardstop') {
      return (
        <div className="contributions-landing-ticker__so-far">
          <div className="contributions-landing-ticker__count">We&#39;ve met our goal &mdash; thank you</div>
        </div>
      );
    }

    return null;
  }


  render() {
    const readyToRender = (this.state && this.state.totalSoFar && this.state.totalSoFar !== 0);
    const allClassModifiers = readyToRender ? this.classModifiers : [...this.classModifiers, 'hidden'];
    const baseClassName = 'contributions-landing-ticker';
    const wrapperClassName = classNameWithModifiers(baseClassName, allClassModifiers);
    const progressBarAnimation = `translateX(${percentageTotalAsNegative(this.state.totalSoFar, this.state.goal)}%)`;

    return (
      <div className={wrapperClassName}>
        <div className="contributions-landing-ticker__values">
          {this.renderContributedSoFar()}
          <div className="contributions-landing-ticker__goal">
            <div className="contributions-landing-ticker__count">${Math.floor(this.state.goal).toLocaleString()}</div>
            <div className="contributions-landing-ticker__count-label contributions-landing-ticker__label">our
              goal
            </div>
          </div>
        </div>
        <div className="contributions-landing-ticker__progress-bar">
          <div className="contributions-landing-ticker__progress">
            <div
              className="contributions-landing-ticker__filled-progress"
              style={{transform: progressBarAnimation}}
            />
          </div>
        </div>
      </div>
    );
  }
}
