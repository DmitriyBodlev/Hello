import * as R from 'ramda';
import { pure, compose, withState, lifecycle, withHandlers } from 'recompose';
// ui
import { Input, Box, Flex, Text, hoverStyles, PositionedBox, PositionedFlex } from '../../ui';
// helpers
import * as H from '../../helpers';
// ////////////////////////////////////////////////////////////////////////////////////////////////

export const handleEnter = (value, props) => {
  const numberValue = Number(value);
  if (H.isNilOrEmpty(value)) {
    props.handleAddNewMove(props.sectionGuid);
  } else if (H.notEquals(NaN, numberValue)) {
    if (R.lte(numberValue, 1)) {
      props.handleCleanSymbol('count', props.guid, props.sectionGuid);
    } else if (R.lte(numberValue, 99)) {
      props.handleSetSymbol({ type: 'count', value }, props.guid, props.sectionGuid);
    }
  } else if (R.isEmpty(props.movesForSelect)) {
    return;
  } else if (R.gte(value.length, 3)) {
    const item = R.head(props.movesForSelect);
    props.handleSetSymbol(item, props.guid, props.sectionGuid);
  }
  props.handleCleanState();
}
export const handleNumeral = (e, key, props) => {
  const move = props.movesForSelect[key - 1];
  if (H.isNotNilAndNotEmpty(move)) {
    props.handleSetSymbol(move, props.guid, props.sectionGuid);
    e.preventDefault();
    props.handleCleanState()
  }
}

export const enhance = compose(
  withState('value', 'setValue', ''),
  withState('movesForSelect', 'setMovesForSelect', []),
  withHandlers({
    handleCleanState: (props) => () => {
      props.setValue('');
      props.setMovesForSelect([]);
    },
  }),
  withHandlers({
    handleKeyDown: (props) => (e) => {
      const value = e.currentTarget.value;
      if (R.equals(e.keyCode, 13)) {
        handleEnter(value, props);
        e.preventDefault();
        return;
      }
      const key = Number(e.key);
      if (R.contains(key, R.range(0, 4))) {
        handleNumeral(e, key, props)
      }
      if (R.and(R.contains(e.keyCode, [8, 46]), H.isNilOrEmpty(value))) {
        if (props.deletable) {
          props.handleDeleteMove(props.guid, props.sectionGuid);
          return;
        }
        props.handleCleanMove(props.guid, props.sectionGuid)
      }
    },
    handleChangeInput: (props) => (e) => {
      const value = e.currentTarget.value.toLowerCase();
      if (R.gte(value.length, 3)) {
        const movesForSelect = R.filter((move) => R.contains(value, move.name.toLowerCase()), props.moves);
        props.setMovesForSelect(R.slice(0, 5, movesForSelect));
      } else {
        props.setMovesForSelect([]);
      }
      props.setValue(value);
    },
    handleClickMove: (props) => (item) => {
      props.handleSetSymbol(item, props.guid, props.sectionGuid);
      props.handleCleanState();
    },
  }),
  pure,
);

const typeColors = {
  move: 'blue',
  style: 'green',
  with: '#924754',
};

const setFocused = (r, focused, handleCleanState) => {
  if (R.and(H.isNotNilAndNotEmpty(r), focused)) {
    r.focus();
  } else if (handleCleanState) {
    handleCleanState();
  }
};

export const getFontSize = (symbolsSize) => {
  let fontSize = symbolsSize / 3;
  if (fontSize > 20) {
    fontSize = 20;
  }
  if (fontSize < 10) {
    fontSize = 10;
  }
  return fontSize;
};

export const SearchedSymbols = (props) => (
  <PositionedBox
    left='0'
    bottom='0'
    overflow='auto'
    position='absolute'
    transform='translateY(100%)'
    maxHeight={props.symbolsSize * 3}
  >
    {props.movesForSelect.map((item, index) => (
      <PositionedFlex
        mt='5px'
        key={index}
        width='100%'
        borderRadius='5px'
        position='relative'
        alignItems='center'
        hoverBg='lightblue'
        p='10px 5px 2px 15px'
        flexDirection='column'
        minHeight='max-content'
        additionalStyles={hoverStyles}
        onClick={() => props.handleClickMove(item)}
        bg={R.equals(index, 0) ? 'lightblue' : 'white'}
      >
        <PositionedBox fontSize={getFontSize(props.symbolsSize)} position='absolute' top='2px' left='2px'>
          {index + 1}
        </PositionedBox>
        <Box maxWidth={props.symbolsSize / 1.5} height={props.symbolsSize / 1.5}>
          <img src={item.icon} height={props.symbolsSize / 1.5}/>
        </Box>
        <Text
          mt='2px'
          p='0 2px'
          color='white'
          fontSize='9px'
          borderRadius='3px'
          bg={typeColors[item.type]}
        >
          {item.type}
        </Text>
      </PositionedFlex>
    ))}
  </PositionedBox>
);

// onBlur={(e) => setFocused(e.currentTarget, props.focused, props.handleCleanState)}
export const InputComponent = enhance((props) => (
  <PositionedFlex
    ml='10px'
    maxHeight='20px'
    overflow='visible'
    position='relative'
    alignItems='center'
    flexDirection='column'
  >
    <Input
      width='100%'
      border='none'
      height='20px'
      minWidth='50px'
      value={props.value}
      onKeyDown={props.handleKeyDown}
      onChange={props.handleChangeInput}
      ref={(r) => setFocused(r, props.focused)}
      onFocus={() => props.setDrawBoxOpened(false)} />
    <SearchedSymbols
      symbolsSize={props.symbolsSize}
      movesForSelect={props.movesForSelect}
      handleClickMove={props.handleClickMove} />
  </PositionedFlex>
))

export default InputComponent;
