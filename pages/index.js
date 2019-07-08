import * as R from 'ramda';
import Head from 'next/head';
import shortid from 'shortid';
// import firebase from 'firebase';
import * as html2canvas from 'html2canvas'
import { pure, compose, withState, lifecycle, withProps, withHandlers } from 'recompose';
// components
import CommonModal from '../components/modal';
import ItemForm from '../components/Item-form';
// constants
import * as C from '../constants';
// features
import SymbolsList from '../feature/symbols-list';
import SymbolsWorkspace from '../feature/symbols-workspace';
// helpers
import * as H from '../helpers';
// hocs
import { withFirebase } from '../hocs';
// ui
import {
  Box,
  Label,
  Button,
  GlobalStyle,
  SelectWrapper,
  PositionedBox,
  PositionedFlex,
  SelectComponent } from '../ui';
import data from '../data/main-data';
import dataJSON from '../data/data.json';
// /////////////////////////////////////////////////////////////////////////////////////////////////

const uploadImage = (props, payload, callback) => {
  // let uploadTask = props.storage.ref().child('images/' + payload.name + '.img').put(payload.imageFile);
  // uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
  //   (snapshot) => {
  //     let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //     console.log('Upload is ' + progress + '% done');
  //     switch (snapshot.state) {
  //       case firebase.storage.TaskState.PAUSED:
  //         console.log('Upload is paused');
  //         break;
  //       case firebase.storage.TaskState.RUNNING:
  //         console.log('Upload is running');
  //         break;
  //       default: break;
  //     }
  //   }, (error) => {
  //     console.log(error);
  //   }, () => {
  //     uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
  //       callback(R.assoc('imageURL', downloadURL, payload))
  //     });
  //   });
};

const genMove = (prev = {}, setFocused, moveGuid, order, tactCount) => {
  if (H.isNotNil(setFocused)) {
    setFocused(moveGuid);
  }
  return R.assoc(moveGuid, { order, guid: moveGuid, tactCount }, prev);
};

const genSection = (prev = {}, order, setFocused) => {
  const guid = shortid.generate();
  const moveGuid = shortid.generate();
  return R.assoc(
    guid,
    {
      guid,
      order,
    },
    prev,
  );
};

const getSymbolsSize = (symbolsSize) => {
  let newSymbolsSize = symbolsSize;
  if (R.not(document)) return symbolsSize;
  const offsetWidth = R.prop('offsetWidth', document.getElementById('divToPrint'));
  if (R.not(offsetWidth)) return symbolsSize;
  if (offsetWidth <= 500) {
    newSymbolsSize = newSymbolsSize / 3;
    if (newSymbolsSize < 20) {
      newSymbolsSize = 20;
    }
  } else if (offsetWidth <= 930) {
    newSymbolsSize = newSymbolsSize / 2;
    if (newSymbolsSize < 30) {
      newSymbolsSize = 30;
    }
  }
  return newSymbolsSize;
}

const enhance = compose(
  withState('data', 'setData', []),
  withState('focusedSymbol', 'setFocused', null),
  withState('menuOpened', 'setMenuOpened', false),
  withState('symbolsSize', 'setSymbolsSize', 100),
  withState('modalOpened', 'setModalOpened', false),
  withState('modalContent', 'setModalContent', null),
  withState('willExportPDF', 'setWillExportPDF', false),
  withState('initialSymbolsSize', 'setInitialSymbolsSize', 100),
  withState('movesSections', 'setMovesSections', (props) => genSection({}, 0, props.setFocused)),
  withHandlers({
    // SECTION HANDLES
    handleAddNewSection: (props) => (sectionGuid) => {
      const currentSection = R.pathOr({}, [sectionGuid], props.movesSections)
      let order = currentSection.order;
      let movesSections = R.map((section) => {
        return {
          ...section,
          order: H.ifElse(R.gte(section.order, order), R.inc(section.order), section.order)
        }
      }, props.movesSections);
      const some = genSection(movesSections, order, props.setFocused);
      props.setMovesSections(some);
    },
    handleDeleteSection: (props) => (sectionGuid) => {
      if (R.lte(R.values(props.movesSections).length, 1)) return;
      props.setMovesSections((prev) => R.omit([sectionGuid], prev));
    },
    handleSetFocused: (props) => (e, data) => {
      if (e) {
        H.isNotNil(e.preventDefault) && e.preventDefault();
        H.isNotNil(e.preventDefault) && e.stopPropagation();
      }
      if (R.is(Array, data)) {
        if (H.notContains([props.focusedSymbol], data)) {
          props.setFocused(R.last(data))
        }
        return;
      }
      props.setFocused(data)
    },
    // MOVE HANDLERS
    // FIREBASE HANDLERS
    handleCreateImage: (props) => (values) => {
      const data = props.data;
      const itemId = shortid.generate();
      const item = { ...values, guid: itemId, type: R.map(R.prop('value'), values.type) };
      const valuesForPick = ['name', 'description', 'icon', 'type', 'engName', 'guid'];
      const itemForLocal = R.pick(valuesForPick, item)
      const newCollectionData = R.assoc(itemId, itemForLocal, data);
      localStorage.setItem('symbols', JSON.stringify(newCollectionData));
      props.setData(newCollectionData);
      props.setModalOpened(false);
      // uploadImage(
      //   props,
      //   values,
      //   (values) => (
      //     props.db
      //       .ref('images')
      //       .push(values)
      //       .then(value => {
      //         props.setModalOpened(false)
      //       })
      //       .catch((error) => console.log('error', error))
      //       .then(() => {
      //         console.log('images')
      //       })
      //   )
      // )
    },
    handleUpdateImage: (props) => (values) => {
      const data = props.data;
      const item = { ...values, type: R.map(R.prop('value'), values.type) };
      const valuesForPick = ['name', 'description', 'icon', 'type', 'engName', 'guid'];
      const itemForLocal = R.pick(valuesForPick, item)
      const newCollectionData = R.assoc(values.guid, itemForLocal, data);
      localStorage.setItem('symbols', JSON.stringify(newCollectionData));
      props.setData(newCollectionData);
      props.setModalOpened(false);
      // uploadImage(
      //   props,
      //   values,
      //   (values) => (
      //     props.db
      //       .ref('images')
      //       .push(values)
      //       .then(value => {
      //         props.setModalOpened(false)
      //       })
      //       .catch((error) => console.log('error', error))
      //       .then(() => {
      //         console.log('images')
      //       })
      //   )
      // )
    },
    handleDeleteImage: (props) => (e, guid) => {
      e.stopPropagation()
      const data = props.data;
      const newCollectionData = R.omit([guid], data);
      localStorage.setItem('symbols', JSON.stringify(newCollectionData));
      props.setData(newCollectionData);
    },
    // FIREBASE HANDLERS
    handleExportJSON: (props) => () => {
      const jsonData = localStorage.getItem('symbols');
      let dataStr = JSON.stringify(jsonData);
      let dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);  
      let exportFileDefaultName = 'data.js';
      let linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    },
    // FIREBASE HANDLERS
    handlePrintDocument: (props) => (makePDF) => {
      // debugger;
      props.setWillExportPDF(true);
      const input = document.getElementById('divToPrint');
      html2canvas(input)
        .then((canvas) => {
          const jsPDF = window.jsPDF
          const imgData = canvas.toDataURL('image/png');
          if (makePDF) {
            const pdf = new jsPDF('p', 'pt', 'a4'); // eslint-disable-line
            const imgWidth = 595;
            const pageHeight = 842;
            const imgHeight = canvas.height * imgWidth / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
            while (heightLeft >= 0) {
              position = heightLeft - imgHeight;
              pdf.addPage();
              pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
              heightLeft -= pageHeight;
            }
            pdf.save('download.pdf');
          } else {
            window.location.href = imgData.replace('image/png', 'image/octet-stream');
          }
          props.setWillExportPDF(false);
        });
    }
  }),
  withHandlers({
    // MODAL
    handleCreateMove: (props) => () => {
      props.setModalOpened(true)
      props.setModalContent(<ItemForm onAction={props.handleCreateImage} closeModal={() => props.setModalOpened(false)} />)
    },
    handleUpdateMove: (props) => (item) => {
      let type = item.type;
      if (R.is(String, type)) {
        type = R.of(type);
      }
      const indexedOptions = R.indexBy(R.prop('value'), C.selectOptions);
      type = type.map((type) => indexedOptions[type]);
      const content = (
        <ItemForm
          onAction={props.handleUpdateImage}
          initialValues={R.assoc('type', type, item)}
          closeModal={() => props.setModalOpened(false)} />
      );
      props.setModalOpened(true)
      props.setModalContent(content);
    }
    // MODAL
  }),
  lifecycle({
    componentDidMount () {
      const localSymbols = localStorage.getItem('symbols');
      let decodedData = null;
      let JSONData = {};
      if (H.isNotNilAndNotEmpty(dataJSON)) {
        decodedData = decodeURIComponent(dataJSON);
        JSONData = JSON.parse(decodedData);
      }
      if (H.isNotNilAndNotEmpty(localSymbols)) {
        const symbols = JSON.parse(localSymbols);
        this.props.setData(R.merge(JSONData, symbols));
        return;
      }
      this.props.setData(JSONData);
    }
  }),
  pure,
);

export const SelectFontSize = (props) => {
  const options = [];
  for (let i = 0; i <= 15; i++) {
    const value = (i * 10) + 30;
    options[i] = <option key={value} value={value}>{value}</option>;
  }
  return (
    <Label display='flex' alignItems='center' ml='10px'>
      Font Size
      <SelectWrapper width='max-content' position='relative'>
        <SelectComponent
          p='0 10px'
          width='70px'
          height='30px'
          lineHeight='30px'
          background='white'
          borderRadius='2px'
          m='10px 15px 15px'
          position='relative'
          border='1px solid gray'
          value={props.symbolsSize}
          onChange={(e) => props.setSymbolsSize(e.currentTarget.value)}
        >
          {options}
        </SelectComponent>
      </SelectWrapper>
    </Label>
  )
};

export const OpenListButton = (props) => {
  const commonStyles = {
    left: '0',
    bg: 'blue',
    top: '50%',
    width: '100%',
    height: '6px',
    cursor: 'pointer',
    borderRadius: '5px',
    position: 'absolute',
    transition: 'all 0.3s linear'
  }
  return (
    <PositionedBox
      top='50%'
      right='10px'
      width='50px'
      height='50px'
      cursor='pointer'
      position='absolute'
      transform='translateY(-50%)'
      onClick={() => props.setMenuOpened(R.not(props.menuOpened))}
    >
      <PositionedBox
        {...commonStyles}
        transform={H.ifElse(
          props.menuOpened,
          'rotate(-45deg)',
          'translateY(calc(-50% - 12px))',
        )} />
      <PositionedBox
        {...commonStyles}
        transform={H.ifElse(
          props.menuOpened,
          'scale(0) translateY(-50%)',
          'translateY(-50%)',
        )} />
      <PositionedBox
        {...commonStyles}
        transform={H.ifElse(
          props.menuOpened,
          'rotate(45deg)',
          'translateY(calc(-50% + 12px))',
        )} />
    </PositionedBox>
  );
};

export const StyledButton = (props) => (
  <Button
    mx='5px'
    bg='white'
    p='5px 10px'
    border='none'
    type='button'
    color='#00057a'
    fontSize='12px'
    cursor='pointer'
    boxShadow='none'
    fontWeight='bold'
    borderRadius='5px'
    onClick={props.onAction}
  >
    {props.children}
  </Button>
);

export default withFirebase(enhance((props) => (
  <div>
    <Head>
      <meta name='viewport' content='width=device-width, initial-scale=1' />
      <title>Скоропис</title>
      <script
        src='https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.5.3/jspdf.debug.js'
        integrity='sha384-NaWTHo/8YCBYJ59830LTz/P4aQZK1sS0SneOgAvhsIl3zBu8r9RevNg5lHCHAuQ/'
        crossOrigin='anonymous' />
    </Head>
    {
      props.modalOpened
      && (
        <CommonModal closeModal={() => props.setModalOpened(false)}>
          {props.modalContent}
        </CommonModal>
      )
    }
    <GlobalStyle />
    <Box mt='70px' height='calc(100vh - 70px)' width='100vw' overflow='auto'>
      <SymbolsWorkspace {...props} symbolsSize={props.willExportPDF ? props.initialSymbolsSize : props.symbolsSize } />
    </Box>
    <PositionedFlex
      top='0'
      left='0'
      p='10px'
      zIndex='10'
      width='100%'
      height='70px'
      bg='lightblue'
      position='fixed'
      alignItems='center'
    >
      <Box>
        <StyledButton onAction={() => props.handlePrintDocument()}>Export Image</StyledButton>
        <StyledButton onAction={() => props.handlePrintDocument(true)}>Export PDF</StyledButton>
      </Box>
      <SelectFontSize symbolsSize={props.initialSymbolsSize} setSymbolsSize={props.setInitialSymbolsSize} />
      <StyledButton onAction={props.handleCreateMove}>Add New Symbol</StyledButton>
      <StyledButton onAction={props.handleExportJSON}>Export Symbols File</StyledButton>
      <Label>
        {'PDF Mode '}
        <input
          type='checkbox'
          checked={props.willExportPDF}
          onChange={() => props.setWillExportPDF(R.not(props.willExportPDF))} />
      </Label>
      <SymbolsList
        data={props.data}
        menuOpened={props.menuOpened}
        handleUpdateMove={props.handleUpdateMove}
        handleDeleteImage={props.handleDeleteImage} />
      <OpenListButton menuOpened={props.menuOpened} setMenuOpened={props.setMenuOpened} />
    </PositionedFlex>
  </div>
)))
