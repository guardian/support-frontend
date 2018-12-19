// @flow

// ----- Imports ----- //
import React, { Component } from 'react';
import { classNameWithModifiers } from 'helpers/utilities';

// ---- Types ----- //
type StateTypes = {|
  totalSoFar: number,
  goal: number,
|}

type PropTypes = {}


// ---- Helpers ----- //

const getInitialTickerValues = (): Promise<StateTypes> =>
  fetch('/ticker.json')
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
export class ContributionUsTicker extends Component<PropTypes, StateTypes> {

  constructor(props: PropTypes) {
    super(props);

    this.state = {
      totalSoFar: 0,
      goal: 0,
    };

  }

  componentDidMount(): void {
    getInitialTickerValues().then(({ totalSoFar, goal }) => {
      const initialTotal = totalSoFar * 0.8;
      this.count = initialTotal;
      this.totalSoFar = totalSoFar;
      this.setState({ totalSoFar: initialTotal, goal });
      window.setTimeout(() => {
        window.requestAnimationFrame(this.increaseCounter);
        this.animateBar(totalSoFar, goal);
      }, 500);
    });
  }

  increaseCounter = this.increaseCounter.bind(this);
  filledProgressBar: ?HTMLDivElement;
  count = 0;
  totalSoFar: number;

  animateBar(totalSoFar: number, goal: number) {
    const progressBarElement = this.filledProgressBar;
    if (progressBarElement && progressBarElement instanceof HTMLElement) {
      progressBarElement.style.transform = `translateX(${percentageTotalAsNegative(totalSoFar, goal)}%)`;
    }
  }

  increaseCounter() {
    const { totalSoFar } = this;
    this.count += Math.floor(totalSoFar / 100);

    if (this.count >= this.totalSoFar) {
      this.setState({ totalSoFar: this.totalSoFar });
    } else {
      this.setState({ totalSoFar: this.count });
      window.requestAnimationFrame(this.increaseCounter);
    }
  }


  render() {
    const baseClassName = 'contributions-landing-ticker';
    const wrapperClassName = (this.state && this.state.totalSoFar && this.state.totalSoFar !== 0) ?
      baseClassName :
      classNameWithModifiers(baseClassName, ['hidden']);

    return (
      <div className={wrapperClassName}>
        <div className="contributions-landing-ticker__border" />
        <div className="contributions-landing-ticker__values">
          <div className="contributions-landing-ticker__so-far">
            <div className="contributions-landing-ticker__count">${Math.floor(this.state.totalSoFar).toLocaleString()}</div>
            <div className="contributions-landing-ticker__count-label contributions-landing-ticker__label">contributed</div>
          </div>
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
              ref={(filledProgressBar) => { this.filledProgressBar = filledProgressBar; }}
              className="contributions-landing-ticker__filled-progress"
            />
          </div>
        </div>
      </div>
    );
  }
}
