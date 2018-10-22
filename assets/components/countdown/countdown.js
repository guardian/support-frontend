// @flow

// ----- Imports ----- //
import React, { Component } from 'react';


// ---- Types ----- //
type PropTypes = {
  date: string
};

type StateTypes = {
  days: number,
  hours: number,
  minutes: number,
  seconds: number,
}

type CountdownTime = {
  t: number,
  days: number,
  hours: number,
  minutes: number,
  seconds: number,
}

// ---- Helpers ----- //
const addLeadingZeros = (value: number): string => {
  value = String(value);
  while (value.length < 2) {
    value = '0' + value;
  }
  return value;
}


// ----- Component ----- //
export default class Countdown extends Component<PropTypes, StateTypes> {
  constructor(props: PropTypes) {
    super(props);

    this.state = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    }
  }

  componentDidMount(): void {
    this.interval = setInterval(() => {
      const date = this.calculateCountdown(this.props.date);
      date.t > 0 ? this.setState(date) : this.stop();
    }, 1000);
  }

  componentWillUnmount(): void {
    this.stop();
  }

  calculateCountdown(endDate: string): CountdownTime {
    const t = Date.parse(new Date(endDate)) - Date.parse(new Date());

    const seconds = Math.floor((t / 1000) % 60);
    const minutes = Math.floor((t / 1000 / 60) % 60);
    const hours = Math.floor((t / (1000 * 60 * 60)) % 24);
    const days = Math.floor(t / (1000 * 60 * 60 * 24));

    return { t, seconds, minutes, hours, days };
  }

  stop(): void {
    clearInterval(this.interval);
  }

  render() {
    const { days, hours, minutes, seconds } = this.state;

    return (
      <time className={this.props.className}>
        {[days, hours, minutes, seconds].map(addLeadingZeros).join(':')}
      </time>
    );
  }
}
