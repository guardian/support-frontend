import React, { Node, Component} from 'react';

class WithState extends Component {
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
