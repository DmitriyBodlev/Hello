import Link from 'next/link'
import * as R from 'ramda';
import shortid from 'shortid';
import Head from 'next/head';
import firebase from 'firebase';
import { compose, withState, lifecycle, withHandlers } from 'recompose';
// components
//
import InputComponent from '../components/input-symbol'
import * as I from '../icons';
import {
  Box,
  Flex,
  Text,
  StyledObject,
  SelectWrapper,
  PositionedBox,
  PositionedFlex,
  SelectComponent } from '../ui';
import { withFirebase } from '../hocs';
import CommonModal from '../components/modal';
import ItemForm from '../components/Item-form';
///////////////////////////////////////////////////////////////////////////////////////////////////

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

const genItem = (prev = {}) => {
  const guid = shortid.generate();
  return R.assoc(guid, { order: R.values(prev).length, guid}, prev);
};

const enhance = compose(
  withState('symbolsSize', 'setSymbolsSize', 100),
  withState('focusedSymbol', 'setFocused', 0),
  withState('moves', 'setMoves', genItem({})),
  withState('data', 'setData', []),
  withState('modalOpened', 'setModalOpened', false),
  withHandlers(() => {
    let ref = null;
    return {
      handleAddMove: ({ setMoves }) => (item, parentGuid) => (
        setMoves((prev) => R.assoc(parentGuid, R.merge(prev[parentGuid], item), prev))
      ),
      handleAddStyle: ({ setMoves }) => (item, parentGuid) => {
        setMoves((prev) =>  R.assoc(parentGuid, R.assoc(item.type, item, prev[parentGuid]), prev))
      },
      handleCreateImage: (props) => (data) => {
        uploadImage(
          props,
          data,
          (data) => (
            props.db
              .ref("images")
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
      handleSetRef: () => (data) => {
        ref = data
      },
  }}),
  lifecycle({
    // componentWillMount() {
    //   debugger;
    //   let imagesRef = this.props.db
    //   .ref("images")
    //   .orderByKey()

    //   .limitToLast(100);
    //   imagesRef
    //     .once("value")
    //     .then(snapshot => {
    //       const images = R.mapObjIndexed(
    //         (value, key) => R.assoc("id", key, value),
    //         snapshot.val() || []
    //       );
    //       localStorage.setItem('data', JSON.stringify(images));
    //       this.props.setData(images);
    //     })
    //     .catch(error => console.log(error))
    //     .then(() => {
    //     });
    // },
    componentDidMount() {
      const images = JSON.parse(localStorage.getItem('data'));
      this.props.setData(images);
    }
  }),
)

export const Move = (props) => (
  <PositionedFlex
    order={props.order}
    position='relative'
    alignItems='center'
    borderRadius='5px'
    position='relative'
    justifyContent='center'
    mt={props.symbolsSize / 2}
    minWidth={`${props.symbolsSize}px`}
    minHeight={`${props.symbolsSize}px`}
    border={props.focused && '1px solid lightblue'}
  >

    {props.count && <Text pl='5px' fontSize={props.symbolsSize / 2}>{props.count.value}</Text> }
    {console.log('props.focused', props.focused)}
    {
      props.With
      && (
        <PositionedBox
          top='0'
          right='5px'
          position='absolute'
          transform='translateY(-100%)'
        >
          <object style={{ height: props.symbolsSize / 2 }} data={props.With.icon} type="image/svg+xml">
            <span>Your browser doesn't support SVG images</span>
          </object>
          {/* {props.with.icon({ w: '10px', h: '10px', color: 'black' })} */}
        </PositionedBox>
      )
    }

    {console.log('props.focused', props.symbolsSize)}
    {
      props.icon
      && (
        <StyledObject height={props.symbolsSize} data={props.icon} type="image/svg+xml">
          <span>Your browser doesn't support SVG images</span>
        </StyledObject>
      )
    }
    {
      props.style
      && (
        <PositionedBox
          bottom='0'
          right='5px'
          position='absolute'
          transform='translateY(110%)'
        >
          <object style={{ height: props.symbolsSize / 2 }} data={props.style.icon} type="image/svg+xml">
            <span>Your browser doesn't support SVG images</span>
          </object>
          {/* {props.style.icon({ w: '15px', h: '15px', color: 'black' })} */}
        </PositionedBox>
      )
    }
    <PositionedFlex position='absolute' right='0' top='50%' transform='translate(100%, -50%)'>
      <InputComponent
        guid={props.guid}
        moves={R.values(props.data)}
        symbolsSize={props.symbolsSize}
        handleAddMove={props.handleAddMove}
        handleAddStyle={props.handleAddStyle} />
    </PositionedFlex>
  </PositionedFlex>
)

export const SelectFontSize = (props) => {
  const options = [];
  for (let i = 0; i <= 80; i++) {
    const value = i + 20;
    options[i] = <option key={value} value={value}>{value}</option>;
  }
  return (
   <SelectWrapper position='relative'>
      <SelectComponent 
        p='0 10px'
        width='50px'
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
  )
};

export const Content = (props) => (
  <Box p m='0 auto' maxWidth='900px' minHeight='100vw' border='1px solid lightgray'>
    <Flex minWidth={props.symbolsSize / 1.5} minHeight={props.symbolsSize} ref={(ref) => props.handleSetRef(ref)} p='10px' alignItems='center'>
      <Flex width='100%' height='100%'>
        {R.values(props.moves).map((item, index) => (
          <Move
            {...item}
            data={props.data}
            focused={R.equals(index, props.focusedSymbol)}
            handleAddMove={props.handleAddMove}
            handleAddStyle={props.handleAddStyle}
            symbolsSize={props.symbolsSize}
            key={index} />
        ))}
      </Flex>
      {/* <InputComponent moves={R.values(props.data)} handleAddMove={props.handleAddMove} handleAddStyle={props.handleAddStyle} /> */}
    </Flex>
    <button onClick={() => props.setModalOpened(true)}>Add</button>
  </Box>
)

export default withFirebase(enhance((props) => (
  <div>
    <Head>
      <meta name='viewport' content='width=device-width, initial-scale=1' />
      <title>Скоропис</title>
    </Head>
    <SelectFontSize symbolsSize={props.symbolsSize} setSymbolsSize={props.setSymbolsSize} />
      {
        props.modalOpened
        && (
          <CommonModal closeModal={() => props.setModalOpened(false)}>
            <ItemForm onAction={props.handleCreateImage} />
          </CommonModal>
        )
      }
    <Content {...props} />
  </div>
)))
