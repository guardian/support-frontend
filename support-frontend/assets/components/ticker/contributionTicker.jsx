// @flow

// ----- Imports ----- //
import React, { Component } from 'react';
import { classNameWithModifiers } from 'helpers/utilities';
import './contributionTicker.scss';
import type { TickerType } from 'pages/new-contributions-landing/campaigns';

// ---- Types ----- //
type StateTypes = {|
  count: number | null,
  goal: number | null,
|}

type PropTypes = {|
  // URL to fetch ticker JSON from
  tickerJsonUrl: string,
  onGoalReached: () => void,
  tickerType: TickerType,
|}

type DataFromServer = {|
  totalContributed: number | null,
  goal: number | null,
|}


// ---- Helpers ----- //
const getInitialTickerValues = (tickerJsonUrl: string): Promise<DataFromServer> =>
  fetch(tickerJsonUrl)
    .then(resp => resp.json())
    .then((data) => {
      const totalContributed = parseInt(data.total, 10);
      const goal = parseInt(data.goal, 10);

      return { totalContributed, goal };
    });

/* *************************************************************
The progress bar always starts with a translationX of
-100% (which is 100% left of where it becomes visible). This
function calculates how far to the right it should be animated
by finding the percentage of the goal that has been fulfilled:
((total / goal) * 100) and then subtracting 100 from it.
Eg. if 40% of our goal has been fulfilled, we want to translate
the progress bar from -100% left to -60% left. The translation
grows nearer to 0 which represents 100% fulfilled. The max this
number can be is 0 but when the goal is 'unlimited' the max
is -15% (representing 85% filled)
*************************************************************** */
const percentageToTranslate = (total: number, goal: number, tickerType: TickerType) => {
  const percentage = ((total / goal) * 100) - 100;
  const endOfFillPercentage = tickerType === 'unlimited' ? -15 : 0;

  return percentage > 0 ? endOfFillPercentage : percentage;
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

    this.dataFromServer = {
      totalContributed: null,
      goal: null,
    };

    this.state = {
      count: 0,
      goal: 0,
    };

  }

  componentDidMount(): void {
    getInitialTickerValues(this.tickerJsonUrl).then(({ totalContributed, goal }) => {
      const initialCount = totalContributed ? totalContributed * 0.8 : 0;

      if (totalContributed && goal && totalContributed >= goal) {
        this.onGoalReached();
        this.classModifiers.push('goal-reached');
        this.goalReached = true;
      }

      this.setState({
        goal,
        count: initialCount || 0,
      });

      this.dataFromServer = {
        totalContributed,
        goal,
      };

      // Only run the number animation if the goal hasn't been reached yet
      if (totalContributed && goal && totalContributed < goal) {
        window.requestAnimationFrame(this.increaseTextCounter);
      }
    });
  }

  onGoalReached: () => void;
  tickerJsonUrl: string;
  tickerType: TickerType;
  classModifiers: Array<?string>;
  goalReached: boolean;
  dataFromServer: DataFromServer;

  increaseTextCounter = () => {
    const nextCount = this.state.count ? this.state.count + Math.floor(this.state.count / 100) : null;

    if (nextCount && this.dataFromServer.totalContributed && nextCount >= this.dataFromServer.totalContributed) {
      this.setState({ count: this.dataFromServer.totalContributed });
    } else if (nextCount) {
      this.setState({ count: nextCount });
      window.requestAnimationFrame(this.increaseTextCounter);
    }
  }

  renderContributedSoFar = () => {
    if (!this.goalReached && this.state.count) {
      return (
        <div className="contributions-landing-ticker__so-far">
          <div className="contributions-landing-ticker__count">${Math.floor(this.state.count).toLocaleString()}</div>
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

    return (<div className="contributions-landing-ticker__so-far" />);
  }


  render() {
    const readyToRender = (this.state && this.state.count && this.state.count !== 0);
    const allClassModifiers = readyToRender ? this.classModifiers : [...this.classModifiers, 'hidden'];
    const baseClassName = 'contributions-landing-ticker';
    const wrapperClassName = classNameWithModifiers(baseClassName, allClassModifiers);
    const progressBarAnimation = `translate3d(${percentageToTranslate(this.dataFromServer.totalContributed || 0, this.dataFromServer.goal || 0, this.tickerType)}%, 0, 0)`;
    const goalCount = this.state.goal ? Math.floor(this.state.goal).toLocaleString() : null;


    return (
      <div className={wrapperClassName}>
        <div className="contributions-landing-ticker__values">
          {this.renderContributedSoFar()}
          <div className="contributions-landing-ticker__goal">
            <div className="contributions-landing-ticker__count">{goalCount}</div>
            <div className="contributions-landing-ticker__count-label contributions-landing-ticker__label">our
              goal
            </div>
          </div>
        </div>
        <div className="contributions-landing-ticker__progress-bar">
          <div className="contributions-landing-ticker__progress">
            <div
              className="contributions-landing-ticker__filled-progress"
              style={{ transform: progressBarAnimation }}
            />
          </div>
        </div>
      </div>
    );
  }
}
