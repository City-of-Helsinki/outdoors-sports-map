import React from "react";
import { Container } from "react-bootstrap";

type Props = {
  id: string;
  className?: string;
  tabIndex?: number;
  role?: string;
};

type State = {
  height: number;
};

class UnitBrowserFilterOptionsWrapper extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      height: 0,
    };
  }

  componentDidMount() {
    const { id } = this.props;
    const menuWrapper = document.getElementById(id);

    if (menuWrapper) {
      const wrapperHeight = menuWrapper.clientHeight;

      this.setState({
        height: wrapperHeight,
      });
    }
  }

  componentWillUnmount() {
    this.setState({
      height: 0,
    });
  }

  render() {
    const { height } = this.state;

    return (
      <div>
        <div
          style={{
            height,
          }}
        />
        <Container {...this.props} />
      </div>
    );
  }
}

export default UnitBrowserFilterOptionsWrapper;
