import * as R from 'ramda';
import React, { useState } from 'react';
import { ChromePicker } from 'react-color';
// ui
import { Box, PositionedBox } from '../../ui';
// ////////////////////////////////////////////////////////////////////////////////////////////////

const handlePickColor = (color, setDisplay, onChangeColor) => {
  setDisplay(false);
  onChangeColor(color.hex);
};

export const ColorPick = (props) => {
  const [ display, setDisplay ] = useState(false);
  return (
    <PositionedBox position='relative' zIndex='20' >
      <Box
        width='20px'
        height='20px'
        cursor='pointer'
        bg={props.color}
        onClick={() => setDisplay(R.not(display))}/>
      {
        display
        && (
          <PositionedBox position='absolute' transform='translate(calc(-100% + 20px))'>
            <ChromePicker onChange={(color) => handlePickColor(color, setDisplay, props.onChangeColor)} />
          </PositionedBox>
        )
      }
    </PositionedBox>
  );
};

export default ColorPick;
