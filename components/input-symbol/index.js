import { useRef } from 'react';
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
    props.handleAddNewMove(props.sectionGuid, props.order + 1, props.tactCount);
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
    if (R.and(R.not(item.typeSelect), R.gt(R.path(['type', 'length'], item), 1))) {
      props.handleSetSelectType(item);
      return;
    }
    if (H.isNotNilAndNotEmpty(item.entities)) {
      props.handleOpenSelectEntity(item, props.handleCleanState);
      return;
    }
    props.handleSetSymbol(R.assoc('type', R.head(item.type), item), props.guid, props.sectionGuid);
  }
  props.handleCleanState();
}

export const handleNumeral = (e, key, props) => {
  const index = key - 1;
  let move = props.movesForSelect[index];
  if (H.isNilOrEmpty(move)) {
    const headMove = R.head(props.movesForSelect);
    if (R.and(H.isNotNilAndNotEmpty(headMove), R.equals(1, props.movesForSelect.length))) {
      move = headMove;
    } else {
      return;
    }
  };
  e.preventDefault();
  if (H.isNotNilAndNotEmpty(move.entities)) {
    props.handleOpenSelectEntity(move, props.handleCleanState);
    return;
  }
  if (R.and(R.not(move.typeSelect), R.gt(R.path(['type', 'length'], move), 1))) {
    props.handleSetSelectType(move);
    return;
  }
  props.handleSetSymbol(R.assoc('type', move.type[index], move), props.guid, props.sectionGuid);
  props.handleCleanState()
};

export const handleNumeralEntity = (e, key, props) => {
  const index = key - 1;
  let entity = R.pathOr([], ['item', 'entities', index], props);
  e.preventDefault();
  props.setModalOpened(false);
  props.handleSetSymbol(R.assoc('type', R.head(entity.type), entity), props.guid, props.sectionGuid);
  props.handleCleanState()
};

export const getFontSize = (symbolsSize, divider = 3) => {
  let fontSize = symbolsSize / divider;
  if (fontSize > 20) {
    fontSize = 20;
  }
  if (fontSize < 10) {
    fontSize = 10;
  }
  return fontSize;
};

const selectEntityEnhance = compose(
  withHandlers({
    handleKeyDown: (props) => (e) => {
      const value = e.currentTarget.value.toLowerCase();
      const key = e.key.toLowerCase();
      const keyCode = e.keyCode;
      const keyNumber = Number(key);
      const lala = R.range(1, R.add(R.pathOr([], ['item', 'entities'], props).length, 1));
      if (R.contains(keyNumber, lala)) {
        handleNumeralEntity(e, keyNumber, props)
      }
    },
  })
);

export const enhance = compose(
  withState('value', 'setValue', ''),
  withState('movesForSelect', 'setMovesForSelect', []),
  withHandlers({
    handleCleanState: (props) => () => {
      props.setValue('');
      props.setMovesForSelect([]);
    },
    handleSetSelectType: (props) => (item) => {
      props.setMovesForSelect(R.of(R.assoc('typeSelect', true, item)))
    },
  }),
  withHandlers({
    handleKeyDown: (props) => (e) => {
      const value = e.currentTarget.value.toLowerCase();
      const key = e.key.toLowerCase();
      const keyCode = e.keyCode;
      if (R.equals(keyCode, 13)) {
        handleEnter(value, props);
        e.preventDefault();
        return;
      }
      const keyNumber = Number(key);
      if (R.contains(keyNumber, R.range(0, 4))) {
        handleNumeral(e, keyNumber, props)
      }
      if (R.and(R.contains(keyCode, [8, 46]), H.isNilOrEmpty(value))) {
        if (props.deletable) {
          props.handleDeleteMove(props.guid, props.sectionGuid);
          return;
        }
        props.handleCleanMove(props.guid, props.sectionGuid)
      }
      const item = R.head(props.movesForSelect);
      if (R.prop('typeSelect', item)) {
        const mappedType = R.indexBy((type) => type[0], item.type);
        const type = R.prop(key, mappedType);
        if (H.isNotNilAndNotEmpty(type)) {
          e.preventDefault();
          props.handleSetSymbol(R.assoc('type', type, item), props.guid, props.sectionGuid);
          props.handleCleanState()
        }
      }
    },
    handleChangeInput: (props) => (e) => {
      const value = e.currentTarget.value.toLowerCase();
      if (R.equals(value, '  ')) {
        props.handleAddNewMove(props.sectionGuid, props.order + 1, props.tactCount + 1, true);
        props.setValue('');
        return;
      }
      if (R.gte(value.length, 3)) {
        const movesForSelect = R.filter((move) => R.or(
          R.contains(value, move.name.toLowerCase()),
          R.contains(value, R.pathOr('', ['engName'], move).toLowerCase())
        ), R.values(props.moves));
        props.setMovesForSelect(R.slice(0, 5, movesForSelect));
      } else {
        props.setMovesForSelect([]);
      }
      props.setValue(value);
    },
    handleClickMove: (props) => (e, item) => {
      e.stopPropagation();
      if (H.isNotNilAndNotEmpty(item.entities)) {
        props.handleOpenSelectEntity(item, props.handleCleanState);
        return;
      }
      let type = item.type;
      if (R.is(Array, type)) {
        if (R.gt(R.path(['type', 'length'], item), 1)) {
          props.handleSetSelectType(item);
          return;
        }
        type = R.head(item.type);
      }
      props.handleSetSymbol(R.assoc('type', type, item), props.guid, props.sectionGuid);
      props.handleCleanState();
    },
  }),
  pure,
);

const typeColors = {
  move: 'blue',
  style: 'green',
  with: '#924754',
  center: 'purple',
  bottom: 'pink',
  top: 'lightgray',
  hand: 'black'
};

const setFocused = (r, focused, handleCleanState) => {
  if (R.and(H.isNotNilAndNotEmpty(r), focused)) {
    r.focus();
  } else if (handleCleanState) {
    handleCleanState();
  }
};

export const SearchedSymbols = (props) => {
  return (
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
          width='100%'
          borderRadius='5px'
          position='relative'
          alignItems='center'
          key={H.genShortId()}
          flexDirection='column'
          minHeight='max-content'
          border='1px solid lightgray'
          additionalStyles={hoverStyles}
          hoverBg={item.typeSelect || 'lightblue'}
          onClick={(e) => props.handleClickMove(e, item)}
          p={H.ifElse(item.typeSelect, '2px 5px', '10px 5px 2px 15px')}
          bg={R.and(R.equals(index, 0), R.not(item.typeSelect)) ? 'lightblue' : 'white'}
        >
          {
            item.typeSelect
            || (
              <PositionedBox fontSize={getFontSize(props.symbolsSize)} position='absolute' top='2px' left='2px'>
                {index + 1}
              </PositionedBox>
            )
          }
          {
            R.not(item.onlyText)
            && (
              <Box
                height={props.symbolsSize / H.ifElse(item.typeSelect, 2.5, 1.5)}
                maxWidth={props.symbolsSize / H.ifElse(item.typeSelect, 2.5, 1.5)}
              >
                <img src={item.icon} height={props.symbolsSize / H.ifElse(item.typeSelect, 2.5, 1.5)}/>
              </Box>
            )
          }
          {
            item.typeSelect
            && (
              item.type.map((type, typeIndex) => (
                <Flex
                  p='5px'
                  mt='2px'
                  width='100%'
                  color='black'
                  fontSize='14px'
                  cursor='pointer'
                  borderRadius='3px'
                  borderRadius='5px'
                  textAlign='center'
                  hoverBg='lightblue'
                  key={H.genShortId()}
                  border='1px solid lightgray'
                  additionalStyles={hoverStyles}
                  bg={R.equals(typeIndex, 0) ? 'lightblue' : 'white'}
                  onClick={(e) => props.handleClickMove(e, R.assoc('type', type, item))}
                >
                  <Box mr='5px' fontWeight='bold'>{typeIndex + 1}</Box>
                  <Box fontWeight='bold'>{type[0]}</Box>{R.slice(1, type.length, type)}
                </Flex>
              ))
            )
          }
          {
            item.typeSelect
            || (
              R.map((type) => (
                <Box
                  mt='2px'
                  p='0 2px'
                  color='white'
                  fontSize='14px'
                  borderRadius='3px'
                  key={H.genShortId()}
                  bg={typeColors[type]}
                >
                  {type}
                </Box>
              ), item.type)
            )
          }
        </PositionedFlex>
      ))}
    </PositionedBox>
  );
};

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
      maxWidth='100px'
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
