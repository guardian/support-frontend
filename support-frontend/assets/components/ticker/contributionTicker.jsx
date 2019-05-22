// @flow

// ----- Imports ----- //
import React, { Component } from 'react';
import { classNameWithModifiers } from 'helpers/utilities';
import './contributionTicker.scss';
import type { TickerType } from 'helpers/campaigns';

// ---- Types ----- //
type StateTypes = {|
  count: number,
  goal: number,
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
      /* ***************************************************************
      Starting the initial count at 80% of its total instead of 0
      affects the increaseTextCounter animation by making it shorter &
      therefore more performant. Animating from 0 to £50,000 (for instance)
      would take significantly longer than we want to run this animation.
      By running it for a short period, we give the experience of the
      number going up as if in real time without taking a big performance
      hit or making the user bored
      ***************************************************************** */
      const initialCount = totalContributed ? totalContributed * 0.8 : 0;

      if (totalContributed && goal && totalContributed >= goal) {
        this.onGoalReached();
        this.classModifiers.push('goal-reached');
        this.goalReached = true;
      }

      this.setState({
        goal: goal || 0,
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
    const nextCount = this.state.count + Math.floor(this.state.count / 100);

    if (this.dataFromServer.totalContributed && nextCount >= this.dataFromServer.totalContributed) {
      this.setState({ count: this.dataFromServer.totalContributed });
    } else {
      this.setState({ count: nextCount });
      window.requestAnimationFrame(this.increaseTextCounter);
    }
  }

  renderContributedSoFar = () => {
    if (!this.goalReached) {
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
    /* *************************************************************
      `translate3d` is preferred to `translateX` because it uses the
      gpu to accelerate the animation. This is especially helpful for
      older computers or phones which may not have the CPU to handle
      two animations happening at the same time (the text counter and
      progress bar). Any transitions with `3d` or `z` in the name
      give you this acceleration, even when the `z-axis` is not being
      operated on.
      https://blog.teamtreehouse.com/increase-your-sites-performance-with-hardware-accelerated-css
      https://davidwalsh.name/translate3d
      *************************************************************** */
    const progressBarAnimation = `translate3d(${percentageToTranslate(this.dataFromServer.totalContributed || 0, this.dataFromServer.goal || 0, this.tickerType)}%, 0, 0)`;
    const readyToRender = (this.state && !Number.isNaN(this.state.count) && this.state.count > -1);
    const allClassModifiers = readyToRender ? this.classModifiers : [...this.classModifiers, 'hidden'];
    const baseClassName = 'contributions-landing-ticker';
    const wrapperClassName = classNameWithModifiers(baseClassName, allClassModifiers);

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
              style={{ transform: progressBarAnimation }}
            />
          </div>
        </div>
      </div>
    );
  }
}
