// @flow
import { Component, type Node, type ComponentType } from 'react';

type PropTypes = {
  loader: Promise<{default: any}>,
  loading: Node,
  children: (ComponentType<*>) => Node
}
type State = {
  loaded: boolean;
}
class Asyncronously extends Component<PropTypes, State> {

  static defaultProps = {
    loading: null,
  };

  state = {
    loaded: false,
  };

  componentDidMount() {
    const { loader } = this.props;
    loader.then((imported) => {
      this.component = imported.default;
      this.setState({ loaded: true });
    });
  }

  component = null;

  render() {
    const { loading, children } = this.props;
    const { loaded } = this.state;
    if (loaded && this.component) {
      return children(this.component);
    }
    return loading;
  }
}

export default Asyncronously;
