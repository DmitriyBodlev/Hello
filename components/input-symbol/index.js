import * as R from 'ramda';
import { compose, withState, withHandlers } from 'recompose';
import { Input, Box, Flex, Text } from '../../ui';
import { SearchItemBox } from './ui';
///////////////////////////////////////////////////////////////////////////////////////////////////

export const enhance = compose(
  withState('value', 'setValue', ''),
  withState('movesForSelect', 'setMovesForSelect', []),
  withHandlers({
    handleChangeInput: (props) => (e) => {
      const value = e.currentTarget.value.toLowerCase();
      if (R.gte(value.length, 3)) {
        const movesForSelect = R.filter((move) => R.contains(value, move.name.toLowerCase()), props.moves)
        props.setMovesForSelect(movesForSelect);
      } else {
        props.setMovesForSelect([]);
      }
      props.setValue(value);
    },
    handleKeyUp: (props) => (e) => {
      const value = e.currentTarget.value;
      if (R.equals(e.keyCode, 13)) {
        if (R.gte(value.length, 3)) {
          const item = R.head(props.movesForSelect)
          if (R.not(R.propEq('type', 'move', item))) {
            props.handleAddStyle(item, props.guid)
          } else {
            props.handleAddMove(item, props.guid);
          }
        } else if (R.is(Number, Number(value))) {
          props.handleAddStyle({ type: 'count', value }, props.guid)
        }
        props.setValue('');
        props.setMovesForSelect([]);
        
        return;
      }
    },
    handleClickMove: (props) => (item) => {
      if (R.not(R.propEq('type', 'move', item))) {
        props.handleAddStyle(item, props.guid)
      } else {
        props.handleAddMove(item, props.guid);
      }
      props.setValue('');
      props.setMovesForSelect([]);
    },
  })
)

const typeColors = {
  move: 'blue',
  style: 'green',
  with: '#924754',
}

export const InputComponent = enhance((props) => (
  <Flex
    ml='10px'
    maxHeight='25px'
    overflow='visible'
    alignItems='center'
    flexDirection='column'
  >
    <Input
      width='100%'
      height='20px'
      border='none'
      minWidth='50px'
      value={props.value}
      onKeyUp={props.handleKeyUp}
      onChange={props.handleChangeInput} />
    {props.movesForSelect.map((item, index) => (
      <SearchItemBox
        key={index}
        p='5px 5px 2px'
        borderRadius='5px'
        width='max-content'
        alignItems='center'
        minHeight='max-content'
        flexDirection='column'
        onClick={() => props.handleClickMove(item)}
        bg={R.equals(index, 0) ? 'lightblue' : 'white'}
      >
        <object style={{ height: props.symbolsSize / 1.5 }} data={item.icon}>
            <span>Your browser doesn't support SVG images</span>
        </object>
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
        </SearchItemBox>
    ))}
  </Flex>
))

export default InputComponent;
