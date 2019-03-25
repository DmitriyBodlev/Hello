import * as R from 'ramda';
import Head from 'next/head';
import shortid from 'shortid';
import firebase from 'firebase';
import * as html2canvas from 'html2canvas'
import { pure, compose, withState, lifecycle, withHandlers } from 'recompose';
// components
import CommonModal from '../components/modal';
import ItemForm from '../components/Item-form';
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
// /////////////////////////////////////////////////////////////////////////////////////////////////

const uploadImage = (props, payload, callback) => {
  let uploadTask = props.storage.ref().child('images/' + payload.name + '.img').put(payload.imageFile);
  uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
    (snapshot) => {
      let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED:
          console.log('Upload is paused');
          break;
        case firebase.storage.TaskState.RUNNING:
          console.log('Upload is running');
          break;
        default: break;
      }
    }, (error) => {
      console.log(error);
    }, () => {
      uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
        callback(R.assoc('imageURL', downloadURL, payload))
      });
    });
};

const genMove = (prev = {}, setFocused, moveGuid) => {
  if (H.isNotNil(setFocused)) {
    setFocused(moveGuid);
  }
  return R.assoc(moveGuid, { order: R.values(prev).length, guid: moveGuid }, prev);
};

const genSection = (prev = {}, setFocused) => {
  const guid = shortid.generate();
  const moveGuid = shortid.generate();
  return R.assoc(
    guid,
    {
      guid,
      order: R.values(prev).length,
      moves: genMove({}, setFocused, moveGuid),
      movesGuids: R.append(moveGuid, R.or(prev.movesGuids, []))
    },
    prev,
  );
};

const enhance = compose(
  withState('data', 'setData', []),
  withState('focusedSymbol', 'setFocused', null),
  withState('menuOpened', 'setMenuOpened', false),
  withState('symbolsSize', 'setSymbolsSize', 100),
  withState('modalOpened', 'setModalOpened', false),
  withState('willExportPDF', 'setWillExportPDF', false),
  withState('movesSections', 'setMovesSections', (props) => genSection({}, props.setFocused)),
  withHandlers({
    // SECTION HANDLES
    handleAddNewSection: (props) => () => (
      props.setMovesSections((prev) => (
        genSection(prev, props.setFocused)
      ))
    ),
    // SECTION HANDLES
    // MOVE HANDLERS
    handleAddNewMove: (props) => (sectionGuid) => (
      props.setMovesSections((prev) => {
        const section = prev[sectionGuid];
        const moveGuid = shortid.generate();
        section.movesGuids = R.append(moveGuid, R.or(section.movesGuids, []))
        section.moves = genMove(section.moves, props.setFocused, moveGuid)
        return R.assoc(sectionGuid, section, prev)
      })
    ),
    handleSetSymbol: ({ setMovesSections }) => (item, moveGuid, sectionGuid) => (
      setMovesSections((prev) => (
        R.assocPath([sectionGuid, 'moves', moveGuid, item.type], item, prev)
      ))
    ),
    handleCleanSymbol: ({ setMovesSections }) => (type, moveGuid, sectionGuid) => (
      setMovesSections((prev) => (
        R.assocPath([sectionGuid, 'moves', moveGuid, type], null, prev)
      ))
    ),
    handleSetFocused: (props) => (e, data) => {
      e.preventDefault();
      e.stopPropagation();
      if (R.is(Array, data)) {
        if (H.notContains([props.focusedSymbol], data)) {
          props.setFocused(R.last(data))
        }
        return;
      }
      props.setFocused(data)
    },
    handleDeleteMove: (props) => (moveGuid, sectionGuid) => {
      let forFocus = null;
      const movesSections = props.movesSections;
      const section = movesSections[sectionGuid];
      section.moves = R.omit([moveGuid], section.moves);
      section.movesGuids = R.without([moveGuid], R.or(section.movesGuids, []));
      forFocus = R.last(section.movesGuids);
      props.setMovesSections(R.assoc(sectionGuid, section, movesSections));
      props.setFocused(forFocus);
    },
    handleCleanMove: (props) => (moveGuid, sectionGuid) => (
      props.setMovesSections((prev) => (
        R.assocPath(
          [sectionGuid, 'moves', moveGuid],
          R.pick(['order', 'guid'], R.path([sectionGuid, 'moves', moveGuid], prev)),
          prev,
        )
      ))
    ),
    // MOVE HANDLERS
    // FIREBASE HANDLERS
    handleCreateImage: (props) => (data) => {
      uploadImage(
        props,
        data,
        (data) => (
          props.db
            .ref('images')
            .push(data)
            .then(value => {
              props.setModalOpened(false)
            })
            .catch((error) => console.log('error', error))
            .then(() => {
              console.log('images')
            })
        )
      )
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
  lifecycle({
    // NOTE: must be here for a while
    componentWillMount () {
      // debugger;
      // let imagesRef = this.props.db
      //   .ref('images')
      //   .orderByKey()

      //   .limitToLast(100);
      // imagesRef
      //   .once('value')
      //   .then(snapshot => {
      //     const images = R.mapObjIndexed(
      //       (value, key) => R.assoc('id', key, value),
      //       snapshot.val() || []
      //     );
      //     localStorage.setItem('data', JSON.stringify(images));
      //     this.props.setData(images);
      //   })
      //   .catch(error => console.log(error))
      //   .then(() => {
      //   });
    },
    componentDidMount () {
      const images = JSON.parse(localStorage.getItem('data'));
      this.props.setData(images);
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
          <ItemForm onAction={props.handleCreateImage} closeModal={() => props.setModalOpened(false)} />
        </CommonModal>
      )
    }
    <GlobalStyle />
    <Box mt='70px' height='calc(100vh - 70px)' width='100vw' overflow='auto'>
      <SymbolsWorkspace {...props} />
    </Box>
    <PositionedFlex
      top='0'
      left='0'
      p='10px'
      zIndex='20'
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
      <SelectFontSize symbolsSize={props.symbolsSize} setSymbolsSize={props.setSymbolsSize} />
      <StyledButton onAction={() => props.setModalOpened(true)}>Add</StyledButton>
      <Label>
        {'PDF Mode '}
        <input
          type='checkbox'
          checked={props.willExportPDF}
          onChange={() => props.setWillExportPDF(R.not(props.willExportPDF))} />
      </Label>
      <SymbolsList menuOpened={props.menuOpened} data={props.data} />
      <OpenListButton menuOpened={props.menuOpened} setMenuOpened={props.setMenuOpened} />
    </PositionedFlex>
  </div>
)))
