import React from 'react';
import * as R from 'ramda';
import {
  pure,
  compose,
  lifecycle,
  withHandlers } from 'recompose';
// ui
import { Box, PositionedBox, PositionedFlex } from '../../ui';
// ////////////////////////////////////////////////////////////////////////////////////////////////

const enhance = compose(
  withHandlers({
    handleCloseModal: (props) => (e) => {
      if (R.equals(e.key, 'Escape')) {
        props.closeModal();
      }
    }
  }),
  lifecycle({
    componentDidMount () {
      document.addEventListener('keyup', this.props.handleCloseModal);
    },
    componentWillUnmount () {
      document.removeEventListener('keyup', this.props.handleCloseModal);
    },
  }),
  pure,
);

export const CloseIcon = (props) => (
  <PositionedBox
    top='10px'
    right='10px'
    border='none'
    fontSize='20px'
    color='darkred'
    cursor='pointer'
    transform='scale'
    position='absolute'
    fontFamily='sans-serif'
    onClick={props.closeModal}
  >
    X
  </PositionedBox>
);

export const ModalComponent = (props) => {
  return (
    <PositionedFlex
      top='0'
      zIndex='11'
      width='100vw'
      height='100vh'
      display='flex'
      position='fixed'
      alignItems='center'
      flexDirection='column'
      justifyContent='center'
      bg='rgba(53, 53, 53, 0.5)'
    >
      <PositionedBox
        top='50%'
        left='50%'
        bg='white'
        borderRadius='2px'
        position='absolute'
        transform='translate(-50%, -50%)'
        boxShadow='0 0 8px 1px rgba(0, 0, 0, 0.2)'
      >
        {props.children}
        <CloseIcon closeModal={props.closeModal} />
      </PositionedBox>
    </PositionedFlex>
  );
};

export default enhance(ModalComponent);
