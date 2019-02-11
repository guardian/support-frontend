// @flow

import React, {type Node, Component} from 'react';

class WithState extends Component<{|initialState: {}, children: Function, refs?: any[]|}, {}> {
  state = {
    ...this.props.initialState
  }
  componentDidMount() {
    this.refs = this.props.refs;
  }
  render() {
    return (
      this.props.children(this.state, (state) => this.setState(state), this.refs)
    );
  }
}

export default WithState;
