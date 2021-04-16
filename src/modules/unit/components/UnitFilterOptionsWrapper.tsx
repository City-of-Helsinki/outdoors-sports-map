import React from "react";
import { Container } from "react-bootstrap";

class UnitFilterOptionsWrapper extends React.Component<{
  id: string;
}> {
  constructor(props) {
    super(props);
    this.state = {
      height: 0,
    };
  }

  componentDidMount() {
    const { id } = this.props;
    const menuWrapper = document.getElementById(id);
    const wrapperHeight = menuWrapper.clientHeight;

    this.setState({
      height: wrapperHeight,
    });
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

export default UnitFilterOptionsWrapper;
