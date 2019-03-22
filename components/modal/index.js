import React from 'react';
import * as R from 'ramda';
import {
  pure,
  compose,
  lifecycle,
  withHandlers } from 'recompose';
// ui
import { Box, Flex, PositionedBox } from '../../ui';
// component modal
import { CloseButton } from './ui';
///////////////////////////////////////////////////////////////////////////////////////////////////

const enhance = compose(
  withHandlers({
    handleCloseModal: (props) => (e) => {
      if (R.equals(e.key, 'Escape')) {
        props.closeModal();
      }
    }
  }),
  lifecycle({
    componentDidMount() {
      document.addEventListener('keyup', this.props.handleCloseModal);
    },
    componentWillUnmount() {
      document.removeEventListener('keyup', this.props.handleCloseModal);
    },
  }),
  pure,
);

export const renderCloseIcon = (props) => (
  <CloseButton
    top='20px'
    right='15px'
    border='none'
    fontSize='20px'
    color='darkred'
    position='absolute'
    fontFamily='sans-serif'
    onClick={props.closeModal}
  >
    X
  </CloseButton>
);

export const ModalComponent = (props) => {
  return (
    <Flex
      top='0'
      zIndex='3'
      width='100vw'
      height='100vh'
      display='flex'
      position='fixed'
      alignItems='center'
      flexDirection='column'
      justifyContent='center'
      background='rgba(53, 53, 53, 0.5)'
    >
      <PositionedBox
        top='50%'
        left='50%'
        borderRadius='2px'
        position='absolute'
        background-color='gray'
        transform='translate(-50%, -50%)'
        boxShadow='0 0 8px 1px rgba(0, 0, 0, 0.2)'
      >
        {renderCloseIcon(props)}
        {props.children}
      </PositionedBox>
    </Flex>
  );
};

export default enhance(ModalComponent);
