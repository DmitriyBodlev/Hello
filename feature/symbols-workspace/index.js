import * as R from 'ramda';
import { pure } from 'recompose';
// components
import InputComponent from '../../components/input-symbol';
import DrawBox from '../../components/drow-box/index';
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
  <Box height={props.height}>
    <img src={props.icon} height={props.height}/>
  </Box>
);

export const SymbolInput = (props) => (
  <PositionedFlex
    top='50%'
    right='0'
    position='absolute'
    transform='translate(100%, -50%)'
  >
    <InputComponent
      guid={props.guid}
      focused={props.focused}
      deletable={props.deletable}
      moves={R.values(props.data)}
      symbolsSize={props.symbolsSize}
      sectionGuid={props.sectionGuid}
      handleCleanMove={props.handleCleanMove}
      handleSetSymbol={props.handleSetSymbol}
      handleAddNewMove={props.handleAddNewMove}
      handleDeleteMove={props.handleDeleteMove} />
  </PositionedFlex>
);

export const ClearActionWrap = (props) => (
  <PositionedFlex position='relative' {...props.positionStyles}>
    {
      props.focused
      && H.shouldReturn(
        props.willExportPDF,
        <PositionedBox
          top='2px'
          left='-2px'
          width='10px'
          bg='#ededed'
          height='10px'
          color='#ff7e00'
          fontSize='10px'
          cursor='pointer'
          fontWeight='bold'
          textAlign='center'
          lineHeight='11px'
          borderRadius='50%'
          position='absolute'
          transform='scaleX(1.2)'
          fontFamily='sans-serif'
          onClick={props.handleCleanSymbol}
        >
          X
        </PositionedBox>,
      )
    }
    {props.children}
  </PositionedFlex>
);

export const Move = pure((props) => {
  const condition = R.and(props.focused, R.not(props.willExportPDF))
  return (
    <PositionedFlex
      mr='5px'
      pl='5px'
      position='relative'
      alignItems='center'
      borderRadius='5px'
      order={props.order}
      justifyContent='center'
      my={props.symbolsSize / 2}
      zIndex={props.focused && '2'}
      minHeight={`${props.symbolsSize}px`}
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
            <Text fontSize={props.symbolsSize / 2.5}>{props.count.value}</Text>
          </ClearActionWrap>
        )
      }
      {
        H.isNotNilAndNotEmpty(props.with)
        && (
          <ClearActionWrap
            focused={props.focused}
            willExportPDF={props.willExportPDF}
            handleCleanSymbol={() => props.handleCleanSymbol(props.with.type, props.guid, props.sectionGuid)}
            positionStyles={{ top: '0', right: 'calc(100% / 6)', position: 'absolute', transform: 'translateY(-100%)' }}
          >
            <Symbol height={props.symbolsSize / 2} icon={props.with.icon} />
          </ClearActionWrap>
        )
      }
      {
        H.isNotNilAndNotEmpty(props.move)
        && (
          <ClearActionWrap
            focused={props.focused}
            willExportPDF={props.willExportPDF}
            handleCleanSymbol={() => props.handleCleanSymbol(props.move.type, props.guid, props.sectionGuid)}
          >
            <Symbol height={props.symbolsSize} icon={props.move.icon} />
          </ClearActionWrap>
        )
      }
      {
        H.isNotNilAndNotEmpty(props.style)
        && (
          <ClearActionWrap
            focused={props.focused}
            willExportPDF={props.willExportPDF}
            handleCleanSymbol={() => props.handleCleanSymbol(props.style.type, props.guid, props.sectionGuid)}
            positionStyles={{ bottom: '0', right: 'calc(100% / 6)', position: 'absolute', transform: 'translateY(110%)' }}
          >
            <Symbol height={props.symbolsSize / 2} icon={props.style.icon} />
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
            focused={props.focused}
            deletable={props.deletable}
            symbolsSize={props.symbolsSize}
            sectionGuid={props.sectionGuid}
            handleCleanMove={props.handleCleanMove}
            handleSetSymbol={props.handleSetSymbol}
            handleAddNewMove={props.handleAddNewMove}
            handleDeleteMove={props.handleDeleteMove} />,
        )
      }
    </PositionedFlex>
  );
});

export const AddSectionButton = (props) => (
  <PositionedBox
    right='5px'
    bottom='-5px'
    width='40px'
    height='40px'
    bg='lightblue'
    fontSize='35px'
    color='#0e497a'
    cursor='pointer'
    hoverBg='#69bcd8'
    lineHeight='40px'
    hoverColor='#fff'
    textAlign='center'
    borderRadius='50%'
    position='absolute'
    transform='translateY(100%)'
    title='Добавити Нову Секцію'
    additionalStyles={hoverStyles}
    onClick={props.handleAddNewSection}
  >
    +
  </PositionedBox>
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

export const Moves = (props) => {
  const moves = R.values(props.section.moves);
  return moves.map((item) => (
    <Move
      {...item}
      key={item.guid}
      data={props.data}
      symbolsSize={props.symbolsSize}
      sectionGuid={props.section.guid}
      deletable={R.gt(moves.length, 1)}
      willExportPDF={props.willExportPDF}
      handleCleanMove={props.handleCleanMove}
      handleSetSymbol={props.handleSetSymbol}
      handleSetFocused={props.handleSetFocused}
      handleAddNewMove={props.handleAddNewMove}
      handleDeleteMove={props.handleDeleteMove}
      handleCleanSymbol={props.handleCleanSymbol}
      focused={R.equals(item.guid, props.focusedSymbol)} />
  ));
};

export const Sections = (props) => {
  const sections = R.reverse(R.values(props.movesSections));
  return sections.map((section) => (
    <PositionedFlex
      width='100%'
      p='10px 20px'
      position='relative'
      alignItems='center'
      minHeight={props.symbolsSize}
      key={section.guid}
      borderBottom='1px solid lightgray'
      minWidth={props.symbolsSize / 1.5}
    >
      <Box mr='10px' width='250px' height='200px' borderRight='1px solid lightgray'>
        <DrawBox />
      </Box>
      <Flex
        width='100%'
        height='100%'
        flexWrap='wrap'
        onClick={(e) => props.handleSetFocused(e, section.movesGuids)}
      >
        <Moves
          section={section}
          data={props.data}
          symbolsSize={props.symbolsSize}
          focusedSymbol={props.focusedSymbol}
          willExportPDF={props.willExportPDF}
          handleCleanMove={props.handleCleanMove}
          handleSetSymbol={props.handleSetSymbol}
          handleSetFocused={props.handleSetFocused}
          handleAddNewMove={props.handleAddNewMove}
          handleDeleteMove={props.handleDeleteMove}
          handleCleanSymbol={props.handleCleanSymbol} />
      </Flex>
      {H.shouldReturn(props.willExportPDF, <AddSectionButton handleAddNewSection={props.handleAddNewSection} />)}
      {/* {H.shouldReturn(props.willExportPDF, <SectionActions />)} */}
    </PositionedFlex>
  ))
}

export const SymbolsWorkspace = (props) => (
  <Box m='40px auto 20px' id='divToPrint' maxWidth='900px' minHeight='100vw' border='1px solid lightgray'>
    <Flex
      width='100%'
      alignItems='center'
      flexDirection='column-reverse'
      minHeight={props.symbolsSize}
    >
      <Sections
        data={props.data}
        symbolsSize={props.symbolsSize}
        willExportPDF={props.willExportPDF}
        focusedSymbol={props.focusedSymbol}
        movesSections={props.movesSections}
        handleCleanMove={props.handleCleanMove}
        handleSetSymbol={props.handleSetSymbol}
        handleSetFocused={props.handleSetFocused}
        handleAddNewMove={props.handleAddNewMove}
        handleDeleteMove={props.handleDeleteMove}
        handleCleanSymbol={props.handleCleanSymbol}
        handleAddNewSection={props.handleAddNewSection} />
    </Flex>
  </Box>
)

export default SymbolsWorkspace;

