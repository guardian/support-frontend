// @flow

// ----- Imports ----- //
import React, { Component } from 'react';


// ---- Types ----- //
type CountdownTime = {
  t: number,
  days: number,
  hours: number,
  minutes: number,
  seconds: number,
}

type PropTypes = {
  date: number[]
};

type StateTypes = {
  countdown: CountdownTime
}


// ---- Helpers ----- //
const addLeadingZeros = (value: number): string => {
  let valueStr = String(value);
  while (valueStr.length < 2) {
    valueStr = `0${valueStr}`;
  }
  return valueStr;
};

const calculateCountdown = (endDate: number[]): CountdownTime => {
  const t = new Date(...endDate).getTime() - Date.now();

  const seconds = Math.floor((t / 1000) % 60);
  const minutes = Math.floor((t / 1000 / 60) % 60);
  const hours = Math.floor((t / (1000 * 60 * 60)) % 24);
  const days = Math.floor(t / (1000 * 60 * 60 * 24));

  return {
    t, seconds, minutes, hours, days,
  };
};


// ----- Component ----- //
export default class Countdown extends Component<PropTypes, StateTypes> {

  constructor(props: PropTypes) {
    super(props);

    this.state = {
      countdown: calculateCountdown(this.props.date),
    };
  }

  componentDidMount(): void {
    this.interval = setInterval(() => {
      const date = calculateCountdown(this.props.date);
      if (date.t > 0) { this.setState({ countdown: date }); } else { this.stop(); }
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
    } = this.state.countdown;

    const units = days > 0 ? [days, hours, minutes] : [hours, minutes, seconds];

    return (
      <time>
        {units.map(addLeadingZeros).join(':')}
      </time>
    );
  }
}
