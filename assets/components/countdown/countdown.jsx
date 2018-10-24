// @flow

// ----- Imports ----- //
import React, { Component } from 'react';
import { addLeadingZeros } from 'helpers/utilities';


// ---- Types ----- //
type CountdownTime = {
  unixTimeLeft: number,
  days: number,
  hours: number,
  minutes: number,
  seconds: number,
}

type PropTypes = {
  to: number
};

type StateTypes = {
  time: CountdownTime
}


// ---- Helpers ----- //
const calculateCountdown = (endDate: number): CountdownTime => {
  const unixTimeLeft = endDate - Date.now();

  const seconds = Math.floor((unixTimeLeft / 1000) % 60);
  const minutes = Math.floor((unixTimeLeft / 1000 / 60) % 60);
  const hours = Math.floor((unixTimeLeft / (1000 * 60 * 60)) % 24);
  const days = Math.floor(unixTimeLeft / (1000 * 60 * 60 * 24));

  return {
    unixTimeLeft, seconds, minutes, hours, days,
  };
};


// ----- Component ----- //
export default class Countdown extends Component<PropTypes, StateTypes> {

  constructor(props: PropTypes) {
    super(props);

    this.state = {
      time: calculateCountdown(this.props.to),
    };
  }

  componentDidMount(): void {
    this.interval = setInterval(() => {
      const time = calculateCountdown(this.props.to);
      if (time.unixTimeLeft >= 0) { this.setState({ time }); } else { this.stop(); }
    }, 1000);
  }

  componentWillUnmount(): void {
    this.stop();
  }

  interval: IntervalID;

  stop(): void {
    clearInterval(this.interval);
  }

  render() {
    const {
      days, hours, minutes, seconds,
    } = this.state.time;

    const units = days > 0 ? [days, hours, minutes, seconds] : [hours, minutes, seconds];

    return (
      <time className="component-countdown">
        {units.map((unit) => { return unit > 0 ? unit : 0 }).map((unit, index) => (
          <span>
            <span className="component-countdown__time">{addLeadingZeros(unit, 2)}</span>
            {index < units.length - 1 && ':'}
          </span>
        ))}
      </time>
    );
  }
}
