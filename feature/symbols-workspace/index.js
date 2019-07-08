import * as R from 'ramda';
import { useState } from 'react';
import shortid from 'shortid';
import { pure, compose, withState, lifecycle, withProps, withHandlers } from 'recompose';
// components
import DrawBox from '../../components/drow-box/index';
import InputComponent from '../../components/input-symbol';
// helpers
import * as H from '../../helpers';
// icons
import * as I from '../../icons';
// ui
import {
  Box,
  Flex,
  Text,
  Input,
  Button,
  hoverStyles,
  PositionedBox,
  PositionedFlex,
  mediaPhoneStyles } from '../../ui';
// /////////////////////////////////////////////////////////////////////////////////////////////////

const Symbol = (props) => (
  <Box height={props.height} width={props.width}>
    <img src={props.icon} height={props.height} width={props.width} />
  </Box>
);

export const SymbolInput = (props) => {
  return (
    <PositionedFlex
      top='50%'
      right='0'
      position='absolute'
      transform='translate(100%, -50%)'
    >
      <InputComponent
        guid={props.guid}
        moves={props.data}
        order={props.order}
        focused={props.focused}
        deletable={props.deletable}
        tactCount={props.tactCount}
        symbolsSize={props.symbolsSize}
        sectionGuid={props.sectionGuid}
        setModalOpened={props.setModalOpened}
        setModalContent={props.setModalContent}
        handleCleanMove={props.handleCleanMove}
        handleSetSymbol={props.handleSetSymbol}
        setDrawBoxOpened={props.setDrawBoxOpened}
        handleAddNewMove={props.handleAddNewMove}
        handleDeleteMove={props.handleDeleteMove}
        handleCleanSymbol={props.handleCleanSymbol}
        handleOpenSelectEntity={props.handleOpenSelectEntity} />
    </PositionedFlex>
  );
};

export const ClearActionWrap = (props) => (
  <PositionedFlex position='relative' {...props.positionStyles}>
    {props.children}
    {
      props.focused
      && H.shouldReturn(
        props.willExportPDF,
        <PositionedBox
          top='2px'
          left='-2px'
          width='12px'
          bg='#ededed'
          height='12px'
          color='#ff7e00'
          fontSize='12px'
          cursor='pointer'
          fontWeight='bold'
          textAlign='center'
          lineHeight='13px'
          borderRadius='50%'
          position='absolute'
          phoneDisplay='none'
          transform='scaleX(1.2)'
          fontFamily='sans-serif'
          onClick={(e) => {
            e.stopPropagation();
            props.handleCleanSymbol()
          }}
        >
          X
        </PositionedBox>,
      )
    }
  </PositionedFlex>
);

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

const Hands = (props) => (
  <PositionedBox
    height={R.divide(props.symbolsSize, 5)}
    position='relative'
    onClick={props.onAction}
    width={R.add(R.divide(props.symbolsSize, 1.5), 5)}
  >
    <PositionedFlex
      left='0'
      top='0'
      position='absolute'
      justifyContent='flex-start'
      width={R.divide(props.symbolsSize, 1.5)}
      transform={`rotate(${R.subtract(360, R.multiply(props.degL, 10))}deg)`}
    >
      <Box transform={`scaleX(-1)`}>
        <Symbol width={R.divide(props.symbolsSize, 3)} icon={props.item.hand.icon} />
      </Box>
    </PositionedFlex>
    <PositionedFlex
      right='0'
      top='0'
      position='absolute'
      justifyContent='flex-end'
      width={R.divide(props.symbolsSize, 1.5)}
      transform={`rotate(${R.multiply(props.degR, 10)}deg)`}
    >
      <Box>
        <Symbol width={R.divide(props.symbolsSize, 3)} icon={props.item.hand.icon} />
      </Box>
    </PositionedFlex>
  </PositionedBox>
);

const poseSettings = [
  {
    icon: I.leg,
    title: 'Legs Position',
    type: ['leg'],
    onlyText: true,
  },
  {
    icon: I.wrist,
    type: ['wrist'],
    title: 'Wrist Position',
  },
  {
    icon: I.head,
    type: ['head'],
    title: 'Head Position',
  },
  {
    icon: I.eyes,
    type: ['eyes'],
    title: 'Eyes Position',
  },
];

const poseTypes = ['leg', 'wrist', 'head', 'eyes'];

const PoseComposition = (props) => {
  return (
    <PositionedFlex mb={props.symbolsSize / 2} alignItems='flex-end'>
      <Box
        fontSize={H.ifElse(props.willExportPDF, props.symbolsSize / 4, props.symbolsSize / 3)}
        color={H.ifElse(props.willExportPDF, '#353535', '#cfe7ef')}
      >
        [
      </Box>
      {poseSettings.map((item) => (
        <Flex
          ml='1px'
          width={props.symbolsSize / 4}
          height={props.symbolsSize / 4}
          borderRadius='5px'
          title={item.title}
          alignItems='center'
          key={H.genShortId()}
          justifyContent='center'
          display={H.ifElse(props.willExportPDF, 'none', 'flex')}
          bg={H.ifElse(props.willExportPDF, 'transparent', '#c4e1eb')}
          onClick={(e) => {
            e.stopPropagation();
            props.handleOpenSelectEntity(R.assoc('entities', props.groupedByType[R.head(item.type)], item))
          }}
          display={H.ifElse(
            R.and(R.or(props.willExportPDF, R.not(props.focused)), H.isNilOrEmpty(props.item[R.head(item.type)])),
            'none',
            'flex',
          )}
        >
          {
            H.isNilOrEmpty(props.item[R.head(item.type)])
            && item.icon('#353535', props.symbolsSize / 4, props.symbolsSize / 4)
          }
          {
            H.isNotNilAndNotEmpty(props.item[R.head(item.type)])
            && <Symbol height={props.symbolsSize / 4} icon={props.item[R.head(item.type)].icon} />
          }
        </Flex>
      ))}
      <Box
        fontSize={H.ifElse(props.willExportPDF, props.symbolsSize / 4, props.symbolsSize / 3)}
        color={H.ifElse(props.willExportPDF, '#353535', '#cfe7ef')}
      >
        ]
      </Box>
    </PositionedFlex>
  );
};

export const handleNumeralEntity = (e, key, props) => {
  const index = key - 1;
  let entity = R.pathOr([], ['item', 'entities', index], props);
  e.preventDefault();
  props.setModalOpened(false);
  props.handleSetSymbol(R.assoc('type', R.head(entity.type), entity), props.guid, props.sectionGuid);
  if (props.onEndAction) {
    props.onEndAction();
  }
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

const SelectEntity = selectEntityEnhance((props) => {
  return (
    <PositionedFlex
      width='400px'
      flexWrap='wrap'
      minHeight='200px'
      position='relative'
      height='max-content'
      p='20px 30px 20px 20px'
    >
      <PositionedBox fontSize='12px' position='absolute' top='-5000px' left='-5000px'>
        <Input
          width='100%'
          border='none'
          height='20px'
          minWidth='50px'
          maxWidth='100px'
          value={props.value}
          ref={(r) => r && r.focus()}
          onKeyDown={props.handleKeyDown} />
      </PositionedBox>
      {R.pathOr([], ['item', 'entities'], props).map((item, index) => (
        <PositionedFlex
          p='15px 5px'
          m='0 5px 5px 0'
          borderRadius='5px'
          alignItems='center'
          width='max-content'
          position='relative'
          hoverBg='lightblue'
          height='max-content'
          key={H.genShortId()}
          border='1px solid lightblue'
          additionalStyles={hoverStyles}
          onClick={() => props.onSelect(item)}
        >
          <img src={item.icon} width={props.symbolsSize / H.ifElse(item.typeSelect, 2.5, 1.5)}/>
          <PositionedBox fontSize='12px' position='absolute' top='2px' left='2px'>
            {index + 1}
          </PositionedBox>
        </PositionedFlex>
      ))}
    </PositionedFlex>
  );
});

const moveEnhance = compose(
  withHandlers({
    handleOpenSelectEntity: (props) => (item, onEndAction) => {
      props.setModalOpened(true)
      const handleSetSymbol = (handItem) => {
        props.setModalOpened(false);
        props.handleSetSymbol(R.assoc('type', R.head(handItem.type), handItem), props.guid, props.sectionGuid);
      }
      props.setModalContent(
        <SelectEntity
          item={item}
          guid={props.guid}
          onEndAction={onEndAction}
          onSelect={handleSetSymbol}
          sectionGuid={props.sectionGuid}
          symbolsSize={props.symbolsSize}
          setModalOpened={props.setModalOpened}
          handleSetSymbol={props.handleSetSymbol} />
      );
    },
  }),
  pure,
);

const getHeight = (symbolsSize, item) => {
  let height = symbolsSize;
  if (H.isNotNilAndNotEmpty(item.hand)) {
    height = R.divide(height, 2)
    // const degL = R.pathOr(0, ['hand', 'degL'], item);
    // const degR = R.pathOr(0, ['hand', 'degR'], item);
    // if (R.or(R.gte(degL, 0), R.gte(degR, 0))) {
    //   const availHeigh = R.multiply(symbolsSize, 0.45)
    //   const availHeighStep = R.divide(availHeigh, 6).toFixed(1);
    //   let multiplier = 0;
    //   if (R.gte(degL, degR)) {
    //     multiplier = R.divide(degL, 1.5)
    //   } else {
    //     multiplier = R.divide(degR, 1.5)
    //   }
    //   multiplier = R.subtract(6, multiplier);
    //   height = R.subtract(height, R.multiply(availHeighStep, multiplier));
    // }
    // if (R.or(R.lt(degL, 0), R.lt(degR, 0))) {
    //   const availHeigh = R.multiply(symbolsSize, 0.45)
    //   const availHeighStep = R.divide(availHeigh, 6).toFixed(1);
    //   let multiplier = 0;
    //   if (R.lte(degL, degR)) {
    //     multiplier = R.divide(R.multiply(degL, -1), 1.5)
    //   } else {
    //     multiplier = R.divide(R.multiply(degR, -1), 1.5)
    //   }
    //   multiplier = R.subtract(6, multiplier);
    //   height = R.subtract(height, R.multiply(availHeighStep, multiplier));
    //   console.log('degR', degR, 'availHeighStep', availHeighStep, 'multiplier', multiplier, 'height', height);
    // }
  }
  return height;
}

export const Move = moveEnhance((props) => {
  const condition = R.and(props.focused, R.not(props.willExportPDF))
  return (
    <Flex order={props.order}>
      <PositionedFlex
        mr='5px'
        pl='5px'
        borderRadius='5px'
        position='relative'
        alignItems='center'
        justifyContent='center'
        my={props.symbolsSize / 2}
        zIndex={props.focused && '2'}
        minHeight={getHeight(props.symbolsSize, props.item)}
        minWidth={`${props.symbolsSize / 1.5}px`}
        onClick={(e) => props.handleSetFocused(e, props.guid)}
        border={H.ifElse(condition, '2px solid lightblue', '2px solid transparent')}
        borderTop={H.ifElse(R.not(props.willExportPDF), '2px solid #cfe7ef', '2px solid transparent')}
        borderBottom={H.ifElse(R.not(props.willExportPDF), '2px solid #cfe7ef', '2px solid transparent')}
      >
        {
          H.isNotNilAndNotEmpty(props.count)
          && (
            <ClearActionWrap
              focused={props.focused}
              willExportPDF={props.willExportPDF}
              handleCleanSymbol={() => props.handleCleanSymbol(props.count.type, props.guid, props.sectionGuid)}
            >
              <Text fontSize={getFontSize(props.symbolsSize)}>{props.count.value}</Text>
            </ClearActionWrap>
          )
        }
        {
          H.isNotNilAndNotEmpty(props.top)
          && (
            <ClearActionWrap
              focused={props.focused}
              willExportPDF={props.willExportPDF}
              handleCleanSymbol={() => props.handleCleanSymbol(props.top.type, props.guid, props.sectionGuid)}
              positionStyles={{ top: '0', right: '50%', position: 'absolute', transform: 'translate(50%, -100%)' }}
            >
              <Symbol height={props.symbolsSize / 2} icon={props.top.icon} />
            </ClearActionWrap>
          )
        }
        {
          H.isNotNilAndNotEmpty(props.center)
          && (
            <ClearActionWrap
              focused={props.focused}
              willExportPDF={props.willExportPDF}
              handleCleanSymbol={() => props.handleCleanSymbol(props.center.type, props.guid, props.sectionGuid)}
            >
              <Symbol height={props.symbolsSize} icon={props.center.icon} />
            </ClearActionWrap>
          )
        }
        {
          H.isNotNilAndNotEmpty(props.hand)
          && (
            <ClearActionWrap
              focused={props.focused}
              willExportPDF={props.willExportPDF}
              handleCleanSymbol={() => props.handleCleanSymbol(props.hand.type, props.guid, props.sectionGuid)}
            >
              <Hands
                item={props.item}
                symbolsSize={props.symbolsSize}
                degL={R.pathOr(0, ['item', 'hand', 'degL'], props)}
                degR={R.pathOr(0, ['item', 'hand', 'degR'], props)}
                onAction={() => props.handleOpenSelectEntityDeg(props.item)} />
            </ClearActionWrap>
          )
        }
        {
          H.isNotNilAndNotEmpty(props.bottom)
          && (
            <ClearActionWrap
              focused={props.focused}
              willExportPDF={props.willExportPDF}
              handleCleanSymbol={() => props.handleCleanSymbol(props.bottom.type, props.guid, props.sectionGuid)}
              positionStyles={{ bottom: '0', right: '50%', position: 'absolute', transform: 'translate(50%, 110%)' }}
            >
              <Symbol height={props.symbolsSize / 2} icon={props.bottom.icon} />
            </ClearActionWrap>
          )
        }
        {
          H.isNotNilAndNotEmpty(props.note)
          && (
            <ClearActionWrap
              focused={props.focused}
              willExportPDF={props.willExportPDF}
              positionStyles={{ top: '0', right: '0', position: 'absolute', transform: 'translate(20%, 0)' }}
              handleCleanSymbol={() => props.handleCleanSymbol(props.note.type, props.guid, props.sectionGuid)}
            >
              <Box onClick={() => props.handleOpenSelectEntity(R.assoc('entities', props.notes, { type: ['note'] }))}>
                <Symbol height={props.symbolsSize / 5} icon={props.note.icon} />
              </Box>
            </ClearActionWrap>
          )
        }
        {
          props.focused
          && H.shouldReturn(
            props.willExportPDF,
            <SymbolInput
              guid={props.guid}
              data={props.data}
              order={props.order}
              focused={props.focused}
              tactCount={props.tactCount}
              deletable={props.deletable}
              symbolsSize={props.symbolsSize}
              sectionGuid={props.sectionGuid}
              setModalOpened={props.setModalOpened}
              setModalContent={props.setModalContent}
              handleCleanMove={props.handleCleanMove}
              handleSetSymbol={props.handleSetSymbol}
              setDrawBoxOpened={props.setDrawBoxOpened}
              handleAddNewMove={props.handleAddNewMove}
              handleDeleteMove={props.handleDeleteMove}
              handleCleanSymbol={props.handleCleanSymbol}
              handleOpenSelectEntity={props.handleOpenSelectEntity} />,
          )
        }
      </PositionedFlex>
      {
        R.or(
          R.and(R.not(props.willExportPDF), props.focused),
          R.any((key) => (
            R.and(R.contains(key, ['wrist', 'leg', 'head', 'eyes']), H.isNotNilAndNotEmpty(props.item[key]))
          ), R.keys(props.item)),
        )
        && (
          <PoseComposition
            item={props.item}
            focused={props.focused}
            symbolsSize={props.symbolsSize}
            willExportPDF={props.willExportPDF}
            groupedByType={props.groupedByType}
            handleOpenSelectEntity={props.handleOpenSelectEntity} />
        )
      }
    </Flex>
  );
});

export const AddSectionButton = (props) => (
  <PositionedFlex
    top='5px'
    right='5px'
    position='absolute'
  >
    <Box
      width='20px'
      height='20px'
      bg='lightblue'
      fontSize='24px'
      color='#0e497a'
      cursor='pointer'
      hoverBg='#69bcd8'
      lineHeight='20px'
      hoverColor='#fff'
      textAlign='center'
      borderRadius='50%'
      title='Добавити Нову Секцію'
      additionalStyles={hoverStyles}
      onClick={props.handleAddNewSection}
    >
      +
    </Box>
    {
      props.withDelete
      && (
        <Box
          ml='5px'
          width='20px'
          height='20px'
          bg='lightcoral'
          fontSize='25px'
          color='#911b1b'
          cursor='pointer'
          hoverBg='#ce5555'
          lineHeight='20px'
          hoverColor='#fff'
          textAlign='center'
          borderRadius='50%'
          title='Видалити Секцію'
          transform='rotate(45deg)'
          additionalStyles={hoverStyles}
          onClick={props.handleDeleteSection}
        >
          +
        </Box>
      )
    }
  </PositionedFlex>
);

export const SectionActions = (props) => (
  <PositionedBox
    top='0'
    right='0'
    width='30px'
    height='30px'
    bg='#b9ccd2'
    position='absolute'
  >
    <PositionedBox
      top='50%'
      left='50%'
      bg='#b9ccd2'
      width='max-content'
      position='absolute'
      height='max-content'
      transform='translate(-50%, -70%)'
    >
      ...
    </PositionedBox>
  </PositionedBox>
);

export const FractionValue = (props) => {
  const [ active, setActive ] = useState(false)
  return (
    <Box width='100%'>
      {
        active
        && (
          <Input
            width='100%'
            height='20px'
            border='none'
            minWidth='50px'
            value={props.value}
            ref={(r) => r && r.focus()}
            onBlur={() => setActive(false)}
            onChange={(e) => props.onAction(e.target.value, props.type)} />
        )
      }
      {
        R.not(active)
        && <Box width='100%' textAlign='center' onClick={() => setActive(true)}>{props.value}</Box>
      }
    </Box>
  );
};

export const Fraction = () => {
  const [ fraction, setFraction ] = useState({ up: '4', down: '4' })
  const handleSetFraction = (value, type) => {
    setFraction(R.assoc(type, value));
  }
  return (
    <Flex alignItems='center' flexDirection='column' width='25px'>
      <FractionValue value={fraction.up} type='up' onAction={handleSetFraction} />
      <Box bg='black' width='100%' height='2px' borderRadius='2px' />
      <FractionValue value={fraction.down} type='down' onAction={handleSetFraction} />
    </Flex>
  );
};

export const Moves = pure((props) => {
  const moves = R.values(props.moves);
  const groupedMoves = R.values(R.groupBy((move) => move.tactCount, moves));
  return (
    groupedMoves.map((moves, index) => (
      <Flex
        px='5px'
        alignItems='center'
        key={shortid.generate()}
        borderLeft={props.willExportPDF ? '1px solid lightgray' : '4px double lightgray'}
      >
        <Box mr='10px'>
          <Fraction />
        </Box>
        {
          moves.map((item) => (
            <Move
              {...item}
              item={item}
              key={item.guid}
              data={props.data}
              notes={props.notes}
              symbolsSize={props.symbolsSize}
              sectionGuid={props.section.guid}
              deletable={R.gt(moves.length, 1)}
              groupedByType={props.groupedByType}
              willExportPDF={props.willExportPDF}
              setModalOpened={props.setModalOpened}
              handleCleanMove={props.handleCleanMove}
              handleSetSymbol={props.handleSetSymbol}
              setModalContent={props.setModalContent}
              setDrawBoxOpened={props.setDrawBoxOpened}
              handleSetFocused={props.handleSetFocused}
              handleAddNewMove={props.handleAddNewMove}
              handleDeleteMove={props.handleDeleteMove}
              handleCleanSymbol={props.handleCleanSymbol}
              focused={R.equals(item.guid, props.focusedSymbol)}
              handleOpenSelectEntityDeg={props.handleOpenSelectEntityDeg} />
          ))
        }
      </Flex>
    ))
  );
});

const genMove = (prev = {}, setFocused, moveGuid, order, tactCount) => {
  if (H.isNotNil(setFocused)) {
    setFocused(null, moveGuid);
  }
  return R.assoc(moveGuid, { order, guid: moveGuid, tactCount }, prev);
};

const SelectSymbolDeg = (props) => {
  const [ degL, setDegL ] = useState(R.pathOr(0, ['item', 'hand', 'degL'], props))
  const [ degR, setDegR ] = useState(R.pathOr(0, ['item', 'hand', 'degR'], props))
  return (
    <Box>
      <Flex
        width='300px'
        height='220px'
        alignItems='center'
        justifyContent='space-around'
      >
        <PositionedFlex
          width='30px'
          height='20px'
          position='relative'
          flexDirection='column'
        >
          <PositionedBox
            left='0'
            bottom='0'
            width='30px'
            height='20px'
            position='absolute'
            transform='rotate(90deg)'
          >
            <PositionedBox
              right='50%'
              bottom='0'
              position='absolute'
              transform='translateX(50%)'
            >
              <input onChange={(e) => setDegL(Number(e.target.value))} type='range' id='degL' name='degL' min='-9' max='9' value={degL} step='1.5' />
            </PositionedBox>
          </PositionedBox>
        </PositionedFlex>
        <Hands symbolsSize={props.symbolsSize} item={props.item} degL={degL} degR={degR} />
        <PositionedFlex
          width='30px'
          height='20px'
          position='relative'
          flexDirection='column'
        >
          <PositionedBox
            left='0'
            bottom='0'
            width='30px'
            height='20px'
            position='absolute'
            transform='rotate(90deg)'
          >
            <PositionedBox
              right='50%'
              bottom='0'
              position='absolute'
              transform='translateX(50%)'
            >
              <input onChange={(e) => setDegR(Number(e.target.value))} type='range' id='degR' name='degR' min='-9' max='9' value={degR} step='1.5' />
            </PositionedBox>
          </PositionedBox>
        </PositionedFlex>
      </Flex>
      <Flex
        p='10px 20px'
        justifyContent='space-between'
      >
        <Button
          width='100px'
          height='30px'
          color='black'
          display='flex'
          alignItems='center'
          justifyContent='center'
          background='white'
          borderRadius='5px'
          onClick={() => props.onAction(R.merge(props.item.hand, { degL, degR }), props.item.guid)}
        >
          Save
        </Button>
        <Button
          width='100px'
          height='30px'
          color='white'
          display='flex'
          alignItems='center'
          justifyContent='center'
          border='1px solid white'
          borderRadius='5px'
          background='transparent'
          onClick={() => props.setModalOpened(false)}
        >
          Cancel
        </Button>
      </Flex>
    </Box>
  );
};

export const enhanceSection = compose(
  withState('sectionMoves', 'setSectionMoves', ({ handleSetFocused }) => genMove({}, handleSetFocused, shortid.generate(), 0, 0)),
  withProps((props) => {
    let hands = [];
    let notes = [];
    const handGuid = H.genShortId();
    const noteGuid = H.genShortId();
    let moves = R.merge(
      {
        [noteGuid]: { type: ['note'], guid: handGuid, onlyText: true, name: 'Нота', engName: 'Note' },
        [handGuid]: { type: ['hand'], guid: handGuid, onlyText: true, name: 'Руки', engName: 'Hands' },
      },
      R.filter((move) => {
        if (R.contains('hand', move.type)) {
          hands = R.append(move, hands);
          return false;
        }
        if (R.contains('note', move.type)) {
          notes = R.append(move, notes);
          return false;
        }
        return true;
      }, props.data));
    moves = R.assocPath([handGuid, 'entities'], hands, moves)
    moves = R.assocPath([noteGuid, 'entities'], notes, moves)
    return {
      data: moves,
      notes: notes,
    };
  }),
  withHandlers({
    handleAddNewMove: (props) => (sectionGuid, order, tactCount = 0, newSection = false) => {
      const newMoves = R.map((move) => {
        if (H.isTrue(newSection)) {
          if (R.gte(move.tactCount, tactCount)) {
            return {
              ...move,
              tactCount: R.inc(move.tactCount),
            }
          }
          return move;
        }
        if (R.equals(move.tactCount, tactCount)) {
          return {
            ...move,
            order: H.ifElse(R.gte(move.order, order), R.inc(move.order), move.order),
          };
        }
        return move;
      }, props.sectionMoves);
      const moves = genMove(newMoves, props.handleSetFocused, shortid.generate(), order, tactCount);
      props.setSectionMoves(moves);
    },
    handleUpdateMove: ({ setSectionMoves }) => (item, moveGuid) => (
      setSectionMoves((prev) => (
        R.assocPath([moveGuid, item.type], item, prev)
      ))
    ),
    handleSetSymbol: ({ setSectionMoves, sectionMoves }) => (item, moveGuid) => {
      let newItem = R.path([moveGuid], sectionMoves)
      if (R.contains(item.type, ['center', 'hand'])) {
        newItem = R.omit(['center', 'hand'], newItem);
      }
      newItem = R.assoc(item.type, item, newItem);
      return setSectionMoves(R.assocPath([moveGuid], newItem, sectionMoves));
    },
    handleCleanSymbol: ({ setSectionMoves }) => (type, moveGuid) => {
      setSectionMoves((prev) => (
        R.assocPath([moveGuid, type], null, prev)
      ))
    },
    handleDeleteMove: (props) => (moveGuid) => {
      let forFocus = null;
      const sectionMoves = R.omit([moveGuid], props.sectionMoves);
      forFocus = R.last(R.values(sectionMoves));
      props.setSectionMoves(sectionMoves);
      props.handleSetFocused(null, forFocus.guid);
    },
    handleCleanMove: (props) => (moveGuid) => {
      props.setSectionMoves((prev) => (
        R.assocPath(
          [moveGuid],
          R.pick(['order', 'guid', 'tactCount'], R.path([moveGuid], prev)),
          prev,
        )
      ))
    },
  }),
  withHandlers({
    handleOpenSelectEntityDeg: (props) => (item) => {
      props.setModalOpened(true)
      const handleSetSymbol = (handItem, guid) => {
        props.setModalOpened(false);
        props.handleUpdateMove(handItem, guid);
      }
      props.setModalContent(
        <SelectSymbolDeg
          item={item}
          onAction={handleSetSymbol}
          symbolsSize={props.symbolsSize}
          setModalOpened={props.setModalOpened} />
      );
    },
  }),
);

export const Section = enhanceSection((props) => {
  const movesGuids = R.values(R.map(R.prop('guid'), props.sectionMoves));
  const ifSectionFocused = R.contains(props.focusedSymbol, movesGuids)
  const [ drawBoxOpened, setDrawBoxOpened ] = useState(false);
  if (H.isFalse(ifSectionFocused) && H.isTrue(drawBoxOpened)) {
    setDrawBoxOpened(false)
  }
  const handleSetDrawBoxOpened = (open) => {
    setDrawBoxOpened(open);
    props.handleSetFocused(null, movesGuids);
  }
  return (
    <PositionedFlex
      width='100%'
      position='relative'
      alignItems='flex-start'
      order={props.section.order}
      minHeight={props.symbolsSize}
      borderBottom='1px solid lightgray'
      minWidth={props.symbolsSize / 1.5}
    >
      <Box mr='10px' width='max-content' height='max-content' borderRight='1px solid lightgray'>
        <DrawBox
          willExportPDF={props.willExportPDF}
          opened={H.ifElse(ifSectionFocused, drawBoxOpened, false)}
          setDrawBoxOpened={ifSectionFocused ? handleSetDrawBoxOpened : (e) => props.handleSetFocused(e, movesGuids) } />
      </Box>
      <Flex
        width='100%'
        height='100%'
        flexWrap='wrap'
        onClick={(e) => {
          setDrawBoxOpened(false)
          props.handleSetFocused(e, movesGuids)
        }}
      >
        <Moves
          data={props.data}
          notes={props.notes}
          section={props.section}
          moves={props.sectionMoves}
          symbolsSize={props.symbolsSize}
          focusedSymbol={props.focusedSymbol}
          willExportPDF={props.willExportPDF}
          setDrawBoxOpened={setDrawBoxOpened}
          groupedByType={props.groupedByType}
          setModalOpened={props.setModalOpened}
          setModalContent={props.setModalContent}
          handleCleanMove={props.handleCleanMove}
          handleSetSymbol={props.handleSetSymbol}
          handleSetFocused={props.handleSetFocused}
          handleDeleteMove={props.handleDeleteMove}
          handleAddNewMove={props.handleAddNewMove}
          handleCleanSymbol={props.handleCleanSymbol}
          handleOpenSelectEntityDeg={props.handleOpenSelectEntityDeg} />
      </Flex>
      {
        H.shouldReturn(
          props.willExportPDF,
          (
            <AddSectionButton
              withDelete={R.not(R.lte(props.sectionsLength, 1))}
              handleAddNewSection={() => props.handleAddNewSection(props.section.guid)}
              handleDeleteSection={() => props.handleDeleteSection(props.section.guid)} />
          ),
        )
      }
    </PositionedFlex>
  );
});

export const Sections = (props) => {
  const sections = R.sort((a, b) => a.order - b.order, R.values(props.movesSections));
  let data = [];
  const groupedByType = R.compose(
    R.groupBy((item) => R.find((type) => R.contains(type, poseTypes), item.type)),
    R.filter((item) => {
      const condition = R.any((type) => R.contains(type, poseTypes), item.type);
      if (R.not(condition)) {
        data = R.append(item, data);
      }
      return condition;
    }),
  )(R.values(props.data));
  return sections.map((section) => (
    <Section
      section={section}
      key={section.guid}
      groupedByType={groupedByType}
      symbolsSize={props.symbolsSize}
      sectionsLength={sections.length}
      focusedSymbol={props.focusedSymbol}
      willExportPDF={props.willExportPDF}
      setModalOpened={props.setModalOpened}
      data={R.indexBy(R.prop('guid'), data)}
      setModalContent={props.setModalContent}
      handleSetFocused={props.handleSetFocused}
      handleCleanSymbol={props.handleCleanSymbol}
      handleDeleteSection={props.handleDeleteSection}
      handleAddNewSection={props.handleAddNewSection}
    />
  ))
}

export const SymbolsWorkspace = (props) => (
  <Box
    id='divToPrint'
    maxWidth='900px'
    minHeight='100vh'
    m='40px auto 20px'
    border='1px solid lightgray'
    minWidth={props.willExportPDF && 900}
  >
    <Flex
      width='100%'
      alignItems='center'
      minHeight={props.symbolsSize}
      flexDirection='column-reverse'
    >
      <Sections
        data={props.data}
        symbolsSize={props.symbolsSize}
        willExportPDF={props.willExportPDF}
        focusedSymbol={props.focusedSymbol}
        movesSections={props.movesSections}
        setModalOpened={props.setModalOpened}
        setModalContent={props.setModalContent}
        handleSetFocused={props.handleSetFocused}
        handleCleanSymbol={props.handleCleanSymbol}
        handleDeleteSection={props.handleDeleteSection}
        handleAddNewSection={props.handleAddNewSection} />
    </Flex>
  </Box>
)

export default SymbolsWorkspace;
