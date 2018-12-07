// @flow

// ----- Imports ----- //
import React, { Component } from 'react';

// ---- Types ----- //
type StateTypes = {|
  totalSoFar: number,
  goal: number,
|}

type PropTypes = {}


// ---- Helpers ----- //

const getInitialTickerValues = (): Promise<{| totalSoFar: number, goal: number |}> =>
  fetch('https://interactive.guim.co.uk/docsdata-test/1ySn7Ol2NQLvvSw_eAnVrPuuRnaGOxUmaUs6svtu_irU.json')
    .then(resp => resp.json())
    .then((data) => {
      const totalSoFar = parseInt(data.sheets.Sheet1[0].total, 10);
      const goal = parseInt(data.sheets.Sheet1[0].goal, 10);

      return { totalSoFar, goal };
    });

const percentageTotalAsNegative = (total: number, goal: number) => {
  let percentage = ((total / goal) * 100) - 100;
  if (percentage > 0) {
    percentage = 0;
  }
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
    const self = this;
    getInitialTickerValues().then(({ totalSoFar, goal }) => {
      const initialTotal = totalSoFar * 0.8;
      this.count = initialTotal;
      this.totalSoFar = totalSoFar;
      self.setState({ totalSoFar: initialTotal, goal });
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
    let wrapperClassName = 'contributions-landing-ticker contributions-landing-ticker--hidden';
    if (this.state && this.state.totalSoFar && this.state.totalSoFar !== 0) {
      wrapperClassName = 'contributions-landing-ticker';
    }

    return (
      <div className={wrapperClassName}>
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
        <div className="contributions-landing-ticker__border" />
      </div>
    );
  }
}
