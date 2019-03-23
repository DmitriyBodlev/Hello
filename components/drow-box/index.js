import React from "react";
// react-draw
import CanvasDraw from 'react-canvas-draw';
// css
//  import className from "./style.css";
// picker
import ButtonExample from '../color-pick/index';
// ui 
import SmallWrapper from './ui';

export class DrawBox extends React.Component {
    state = {
      color: "orange",
      width: 240,
      height: 150,
      brushRadius: 4,
      lazyRadius: 0
    };
    render() {
        return (
          <div>
            <SmallWrapper>
              <ButtonExample onChangeColor={color => this.setState({ color })} />
              <div
                style={{
                  display: "inline-block",
                  width: "30px",
                  height: "30px",
                  backgroundColor: this.state.color,
                  border: "1px solid #272727"
                }}
              />
               <div>
                {/* <label>Radius:</label> */}
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
              {/* <div>
                <label>Height:</label>
                <input
                  type="number"
                  value={this.state.height}
                  onChange={e =>
                    this.setState({ height: parseInt(e.target.value, 10) })
                  }
                />
              </div> */}
             
              <div />
            </div>
            <CanvasDraw
              ref={canvasDraw => (this.saveableCanvas = canvasDraw)}
              brushColor={this.state.color}
              brushRadius={this.state.brushRadius}
              lazyRadius={this.state.lazyRadius}
              canvasWidth={this.state.width}
              canvasHeight={this.state.height}
            />
          </div>
        );
      }
    }
export default DrawBox;
