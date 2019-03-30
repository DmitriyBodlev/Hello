import * as R from 'ramda';
// import CanvasDraw from 'react-canvas-draw';
import React, { useState, useRef } from 'react';
// components
import ColorPick from '../color-pick/index';
// helpers
import * as H from '../../helpers';
// icons
import * as I from '../../icons';
// ui
import { Box, Flex, Button, Input, Label, PositionedBox, PositionedFlex } from '../../ui';
// ////////////////////////////////////////////////////////////////////////////////////////////////

export const StyledButton = (props) => (
  <Button
    mx='5px'
    p='3px 5px'
    border='none'
    type='button'
    color='white'
    fontSize='12px'
    cursor='pointer'
    boxShadow='none'
    fontWeight='bold'
    borderRadius='5px'
    onClick={props.onAction}
    bg={R.or(props.bg, '#00057a')}
  >
    {props.children}
  </Button>
);

export const DrawMenu = (props) => (
  <Flex p='3px 5px' bg='#f0f6ff' justifyContent='space-between' borderBottom='1px solid lightgray'>
    <StyledButton bg='#8283c0' onAction={() => props.saveableCanvas.current.undo()}>
      Undo
    </StyledButton>
    <StyledButton bg='#da918f' onAction={() => props.saveableCanvas.current.clear()}>
      Clear
    </StyledButton>
    <Label>
      Radius:{' '}
      <Input
        width='50px'
        type='number'
        value={props.drawSetting.brushRadius}
        onChange={e => props.setDrawSetting(
          R.assoc('brushRadius', parseInt(e.target.value, 10), props.drawSetting)
        )}
      />
    </Label>
    <ColorPick
      color={props.drawSetting.color}
      onChangeColor={color => props.setDrawSetting(R.assoc('color', color, props.drawSetting))} />
  </Flex>
);

export const DrawBox = (props) => {
  const saveableCanvas = useRef(null)
  const [ drawSetting, setDrawSetting ] = useState({
    width: 250,
    height: 200,
    lazyRadius: 0,
    brushRadius: 1,
    color: 'black',
    hideGrid: true,
  });
  const shouldShowDraw = R.or(props.opened, props.willExportPDF);
  R.map(
    (item) => { item.style.display = H.ifElse(shouldShowDraw, 'block', 'none'); return item; },
    R.pathOr([{ style: {} }], ['current', 'canvas'], saveableCanvas),
  )
  return (
    <PositionedFlex
      overflow='hidden'
      flexDirection='column'
      justifyContent='flex-end'
      width={shouldShowDraw ? 'auto' : '30px'}
      height={shouldShowDraw ? 200 + 28 : '30px'}
      boxShadow='0 0 5px 1px rgba(0, 0, 0, 0.3)'
    >
      {
        H.shouldReturn(
          R.or(props.willExportPDF, R.not(props.opened)),
          <DrawMenu saveableCanvas={saveableCanvas} drawSetting={drawSetting} setDrawSetting={setDrawSetting} />,
        )
      }
      {
        R.and(R.not(props.willExportPDF), R.not(props.opened))
        && (
          <Box
            p='5px'
            width='30px'
            height='30px'
            boxShadow='0 0 5px 1px rgba(0, 0, 0, 0.3)'
            onClick={() => props.setDrawBoxOpened(true)}
          >
            {I.drawIcon()}
          </Box>
        )
      }
    </PositionedFlex>
  );
};

export default DrawBox;
