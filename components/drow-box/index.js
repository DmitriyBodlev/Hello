import React from "react";
// react-draw
import CanvasDraw from 'react-canvas-draw';
// picker
import ButtonExample from '../color-pick/index';
// ui 
import SmallWrapper from './ui';
// /////////////////////////////////////////////////////////
export class DrawBox extends React.Component {
  state = {
    color: "orange",
    width: 240,
    height: 150,
    lazyRadius: 0,
    brushRadius: 4,
  };
  render() {
      return (
        <div>
          <SmallWrapper>
            <ButtonExample onChangeColor={color => this.setState({ color })} />
            <div
              style={{
                width: "30px",
                height: "30px",
                display: "inline-block",
                border: "1px solid #272727",
                backgroundColor: this.state.color,
              }}
            />
            <div>
              <input
                type="number"
                value={this.state.brushRadius}
                style={{width:"50px"}}
                onChange={e =>
                this.setState({ brushRadius: parseInt(e.target.value, 10) })
              }
              />
            </div>
          </SmallWrapper>
          <div>
            <button
              onClick={() => {
                localStorage.setItem(
                  "savedDrawing",
                  this.saveableCanvas.getSaveData()
                );
              }}
            >
              Save
            </button>
            <button
              onClick={() => {
                this.saveableCanvas.clear();
              }}
            >
              Clear
            </button>
            <button
              onClick={() => {
                this.saveableCanvas.undo();
              }}
            >
              Undo
            </button>
          </div>
          <CanvasDraw
            brushColor={this.state.color}
            canvasWidth={this.state.width}
            canvasHeight={this.state.height}
            lazyRadius={this.state.lazyRadius}
            brushRadius={this.state.brushRadius}
            ref={canvasDraw => (this.saveableCanvas = canvasDraw)}                             
          />
        </div>
      );
    }
  }
export default DrawBox;

