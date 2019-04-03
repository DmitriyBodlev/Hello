import * as R from 'ramda';
import React, { useState } from 'react';
// helpers
import * as H from '../../helpers';
// select
import Select from 'react-select';
// ui
import {
  Box,
  Flex,
  Label,
  Input,
  Header,
  Button,
  TextArea,
  SelectWrapper,
  SelectComponent } from '../../ui';
// ////////////////////////////////////////////////////////////////////////////////////////////////

export const ImageWrapper = ({ image }) => {
  if (H.isNotNilAndNotEmpty(image)) {
    return (
      <Box
        width='100%'
        height='100%'
        display='flex'
        overflow='hidden'
        alignItems='center'
        justifyContent='center'
        boxShadow='5px 5px 21px 1px rgba(0, 0, 0, 0.6)'
      >
        <object style={{ height: '100%' }} data={image}>
          <span>Your browser doesn't support SVG images</span>
        </object>
        <Box
          width='100%'
          height='100%'
          backgroundSize='cover'
          backgroundRepeat='no-repeat'
          backgroundPosition='center center'
          backgroundImage={`url(${image})`} />
      </Box>
    );
  }
  return null;
};

const handleSetImage = (event, imageState, setImageState) => {
  event.preventDefault();
  const some = event.nativeEvent.dataTransfer.getData('Url');
  const imageFile = event.nativeEvent.dataTransfer.files[0];
  const imageType = /image.*/;
  if (R.not(imageFile)) return;
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
      )
    };
    reader.readAsDataURL(imageFile);
  }
};

export const Dropzone = (props) => (
  <Box
    width='250px'
    m='15px auto'
    height='300px'
    display='flex'
    borderRadius='2px'
    position='relative'
    alignItems='center'
    background='#dcd0e2'
    justifyContent='center'
    border='1px dashed #b1b1b1'
    onDrop={(e) => handleSetImage(e, props.imageState, props.setImageState)}
    borderStyle={H.isNilOrEmpty(R.prop('icon', props.imageState)) ? 'dashed' : 'solid'}
    onDragOver={(e) => {
      e.nativeEvent.dataTransfer.setData('Url', 'http://www.google.fr');
      e.preventDefault();
    }}
  >
    <ImageWrapper image={R.prop('icon', props.imageState)}/>
  </Box>
);

const selectOptions = [
  { label: '', value: '' },
  { label: 'Move', value: 'move' },
  { label: 'Style', value: 'style' },
  { label: 'With', value: 'with' },
];


class AppSelect extends React.Component {
  state = {
    selectedOption: null,
  }
  handleChange = (selectedOption) => {
    this.setState({ selectedOption });
    console.log(`Option selected:`, selectedOption);
  }
  render() {
    const { selectedOption } = this.state;
 
    return (
      <Select
        isMulti={true}
        value={selectedOption}
        options={selectOptions}
        onChange={this.handleChange}
      />
    ); 
}}

// TODO: with validation
const ImageForm = props => {
  let initialState = { icon: null, name: '', nameTwo: '', type: '', withImageUpdate: false };
  if (R.not(R.isNil(props.initialValues))) {
    initialState = R.merge(initialState, props.initialValues)
  }
  const [ imageState, setImageState ] = useState(initialState);
  const [a, b] = useState('');
  return (
    <Box background='#b3a8b8'>
      <Header
        p='20px 20px 0'
        fontSize='20px'
      >
        Manage Images
      </Header>
      <Dropzone imageState={imageState} setImageState={setImageState} />
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
          Назва(укр)
        </Label>
        <Box
          display='flex'
          position='relative'
          alignItems='center'
          justifyContent='baseline'
        >
          <Input
            p='0 10px'
            width='190px'
            fontSize='16'
            height='30px'
            background='white'
            borderRadius='2px'
            m='0px 15px 15px 25px'
            border='1px solid grey'
            value={imageState.name}
            onChange={(e) => setImageState({ ...imageState, name: e.currentTarget.value })} />
        </Box>
      </Box>
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
          Назва(eng)
        </Label>
        <Box
          display='flex'
          position='relative'
          alignItems='center'
          justifyContent='baseline'
        >
          <Input
            p='0 10px'
            width='190px'
            fontSize='16'
            height='30px'
            background='white'
            borderRadius='2px'
            m='0px 15px 15px 25px'
            border='1px solid grey'
            value={imageState.nameTwo}
            onChange={(e) => setImageState({ ...imageState, nameTwo: e.currentTarget.value })} />
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
        <Flex
          mr='25px'
          width='215px'
          flexDirection='column'
        >
        {/* <SelectWrapper position='relative'> */}
          {/* <SelectComponent
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
          </SelectComponent> */}
          
          {/* <Select 
            isMulti={true}
            options={selectOptions}
            value={selectOptions.label}
          >
          </Select> */}
          <AppSelect/>
          <TextArea
            my='20px'
          >
            lorem15
          </TextArea>
        {/* </SelectWrapper> */}
        </Flex>
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

