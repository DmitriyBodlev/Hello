
import React, { useState } from "react";
import * as R from "ramda";
import Dropzone from 'react-dropzone';
// ui
import { Box } from '../../ui';
// feature image
import {
  Label,
  Input,
  Header,
  Button,
  SelectWrapper,
  DropzoneWrapper,
  SelectComponent } from '../../ui';
///////////////////////////////////////////////////////////////////////////////////////////////////

export const renderImageWrapper = (image) => (
  R.and(
    R.not(R.isNil(image)),
    <Box
      width='100%'
      height='100%'
      display='flex'
      overflow='hidden'
      alignItems='center'
      justifyContent='center'
      boxShadow='5px 5px 21px 1px rgba(0, 0, 0, 0.6)'
    >
      <object style={{ height: '100%', fill: 'red' }} data={image}>
          <span>Your browser doesn't support SVG images</span>
      </object>
      <Box
        width='100%'
        height='100%'
        backgroundSize='cover'
        backgroundRepeat='no-repeat'
        backgroundPosition='center center'
        backgroundImage={`url(${image})`} />
    </Box>,
  )
);


const handleSetImage = (event, imageState, setImageState) => {
  event.preventDefault();
  const some = event.nativeEvent.dataTransfer.getData("Url");
  const imageFile = event.nativeEvent.dataTransfer.files[0];
  // console.log('some', some, event.nativeEvent.dataTransfer)
  // debugger;
  const imageType = /image.*/;
  if (!imageFile) return;
  if (imageFile.type.match(imageType)) {
    const reader = new window.FileReader();
    reader.onload = () => {
      return (
      setImageState({
        ...imageState,
        icon: reader.result,
        fileName: imageFile.name,
        withImageUpdate: true,
        imageFile,
      })
    )};
    reader.readAsDataURL(imageFile);
  }
};

export const renderDropzoneWrapper = (imageState, setImageState) => (
  <DropzoneWrapper
    width='250px'
    m='15px auto'
    height='400px'
    display='flex'
    borderRadius='2px'
    position='relative'
    alignItems='center'
    background='#dcd0e2'
    justifyContent='center'
    border='1px dashed #b1b1b1'
    onDragOver={(e) => {
      e.nativeEvent.dataTransfer.setData("Url","http://www.google.fr");
      e.preventDefault();
    }}
    onDrop={(e) => handleSetImage(e, imageState, setImageState)}
    withLogo={R.not(R.isNil(R.prop('icon', imageState)))}
  >
    {/* <Dropzone className='dropzone' onDrop={(e) => handleSetImage(e, imageState, setImageState)}>
      <p>Upload</p>
    </Dropzone> */}
    {console.log('imageState', imageState)}
    {renderImageWrapper(R.prop('icon', imageState))}
  </DropzoneWrapper>
);

const selectOptions = [
  { label: '', value: '' },
  { label: 'Move', value: 'move' },
  { label: 'Style', value: 'style' },
  { label: 'With', value: 'with' },
]

// TODO: with validation
const ImageForm = props => {
  let initialState = { icon: null, name: '', type: '', withImageUpdate: false };
  if (R.not(R.isNil(props.initialValues))) {
    initialState = R.merge(initialState, props.initialValues)
  }
  const [ imageState, setImageState ] = useState(initialState)
  return (
    <Box background='#b3a8b8'>
      <Header
        p='20px 20px 0'
        fontSize='20px'
      >
        Manage Images
      </Header>
      {renderDropzoneWrapper(imageState, setImageState)}
      <Box
        display='flex'
        minHeight='30px'
        alignItems='center'
      >
        <Label
          color='black'
          width='70px'
          display='flex'
          fontSize='16px'
          m='5px 0 5px 15px'
        >
          Назва
        </Label>
        <Box
          display='flex'
          position='relative'
          alignItems='center'
          justifyContent='baseline'
        >
          <Input
            p='0 10px'
            width='200px'
            fontSize='16'
            height='30px'
            background='white'
            borderRadius='2px'
            m='10px 15px 15px'
            border='1px solid grey'
            value={imageState.name}
            onChange={(e) => setImageState({ ...imageState, name: e.currentTarget.value })} />
        </Box>
      </Box>
      <Box
        display='flex'
        minHeight='30px'
        alignItems='center'
        justifyContent='baseline'
      >
        <Label
          color='black'
          width='70px'
          display='flex'
          fontSize='16px'
          m='5px 0 5px 15px'
        >
          Тип
        </Label>
        <SelectWrapper position='relative'>
          <SelectComponent 
            p='0 10px'
            width='200px'
            height='30px'
            lineHeight='30px'
            background='white'
            borderRadius='2px'
            m='10px 15px 15px'
            position='relative'
            border='1px solid gray'
            value={imageState.type}
            onChange={(e) => setImageState({ ...imageState, type: e.currentTarget.value })}
          >
            {selectOptions.map((option, index) => (
              <option key={index} value={option.value}>{option.label}</option>  
            ))}
          </SelectComponent>
        </SelectWrapper>
      </Box>
      <Box
        p='10px 20px'
        display='flex'
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
          onClick={() => props.onAction(imageState)}
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
          onClick={props.closeModal}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default ImageForm;