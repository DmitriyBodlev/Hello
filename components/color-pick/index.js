import React from "react";
import { ChromePicker } from "react-color";

class ButtonExample extends React.Component {
  state = {
    displayColorPicker: false
  };

  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  };

  handleClose = color => {
    this.props.onChangeColor(color.hex);
    this.setState({ displayColorPicker: false });
  };

  render() {
    const popover = {
      zIndex: "1",
      position: "absolute", 
    };
    const cover = {
      top: "0px",
      left: "0px",
      right: "0px",
      bottom: "0px",
      position: "fixed"       
    };
    return (
      <div>
        <button onClick={this.handleClick}>Pick Color</button>
        {this.state.displayColorPicker ? (
          <div style={popover}>
            <ChromePicker onChange={this.handleClose} />
          </div>
        ) : null}
      </div>
    );
  }
}
  
  export default ButtonExample;
  