import * as R from 'ramda';
// helpers
import * as H from '../../helpers';
// ui
import {
  Box,
  Flex,
  Text,
  hoverStyles,
  PositionedBox,
  PositionedFlex } from '../../ui';
// /////////////////////////////////////////////////////////////////////////////////////////////////

const Symbol = (props) => (
  <Box height={props.height} width={props.width}>
    <img src={props.icon} height={props.height} width={props.width}/>
  </Box>
);

const typeColors = {
  move: 'blue',
  style: 'green',
  with: '#924754',
  center: 'purple',
  bottom: 'pink',
  top: 'lightgray',
};

export const SymbolDetails = (props) => (
  <PositionedFlex
    mb='5px'
    width='100%'
    height='100px'
    borderRadius='5px'
    position='relative'
    border='1px solid lightgray'
    onClick={props.handleUpdateMove}
    boxShadow='0px 0px 2px 1px rgba(0, 0, 0, 0.1)'
  >
    <Box p='5px' textAlign='center' width='100px' borderRight='1px solid lightgray'>
      <Symbol height={'100%'} width='100%' icon={props.icon} />
    </Box>
    <Box height='100px' width='100%'>
      <Flex alignItems='center' p='5px 10px' width='100%'>
        <Box mr='5px' textTransform='capitalize'>
          {props.name}
        </Box>
        <Flex alignItems='center' p='5px 10px' width='100%'>
          {R.map((type) => (
            <Box
              p='2px 5px'
              color='white'
              borderRadius='5px'
              key={H.genShortId()}
              bg={typeColors[type]}
            >
              {type}
            </Box>
          ), props.type)}
        </Flex>
      </Flex>
      <Box
        width='100%'
        p='5px 10px'
        borderTop='1px solid lightgray'
      >
        {R.or(props.description, '-')}
      </Box>
    </Box>
    <PositionedFlex
      top='2px'
      right='2px'
      cursor='pointer'
      position='absolute'
      onClick={(e) => props.handleDeleteImage(e, props.guid)}
    >
      X
    </PositionedFlex>
  </PositionedFlex>
);

export const SymbolsList = (props) => (
  <PositionedFlex
    top='0'
    pt='150px'
    m='0 auto'
    bg='white'
    width='350px'
    height='100vh'
    position='fixed'
    alignItems='center'
    flexDirection='column'
    transition='right 0.3s linear'
    borderLeft='1px solid lightgray'
    boxShadow='1px 1px 5px 1px rgba(0, 0, 0, 0.3)'
    right={H.ifElse(props.menuOpened, '0', '-350px')}
  >
    <Box
      width='300px'
      overflow='auto'
      height='calc(100% - 80px)'
      boxShadow='-1px 0px 4px 1px rgba(173, 216, 230, 0.5)'
    >
      <Flex
        width='100%'
        alignItems='center'
        height='max-content'
        flexDirection='column'
      >
        {R.values(props.data).map((item) => (
          <SymbolDetails
            {...item}
            key={item.guid}
            handleDeleteImage={props.handleDeleteImage}
            handleUpdateMove={() => props.handleUpdateMove(item)} />
        ))}
      </Flex>
    </Box>
  </PositionedFlex>
)

export default SymbolsList;
