import * as R from 'ramda';
import styled from 'styled-components';
import {
  top,
  left,
  flex,
  size,
  ratio,
  color,
  space,
  order,
  width,
  right,
  height,
  bottom,
  border,
  zIndex,
  opacity,
  display,
  position,
  fontSize,
  flexWrap,
  overflow,
  maxWidth,
  minWidth,
  maxHeight,
  minHeight,
  textAlign,
  boxShadow,
  borderTop,
  background,
  alignItems,
  lineHeight,
  fontWeight,
  borderLeft,
  borderColor,
  borderRight,
  borderBottom,
  borderRadius,
  letterSpacing,
  flexDirection,
  justifyContent,
  gridTemplateColumns } from 'styled-system';
// helpers
import * as H from '../helpers';
// //////////////////////////////////////////////////////////////////////////////

export const createMinWithMediaQuery = n => `
  @media screen and (min-width: ${n}px)
`;

export const createMaxWithMediaQuery = n => `
  @media screen and (max-width: ${n}px)
`;

export const Box = styled.div`
  ${flex}
  ${size}
  ${ratio}
  ${color}
  ${space}
  ${width}
  ${order}
  ${height}
  ${border}
  ${zIndex}
  ${opacity}
  ${display}
  ${fontSize}
  ${overflow}
  ${position}
  ${maxWidth}
  ${minWidth}
  ${textAlign}
  ${maxHeight}
  ${minHeight}
  ${boxShadow}
  ${borderTop}
  ${borderLeft}
  ${borderRight}
  ${borderColor}
  ${borderBottom}
  ${borderRadius}
  transform: ${({ transform }) => transform};
`;

export const PositionedBox = styled(Box)`
  ${top}
  ${left}
  ${right}
  ${bottom}
  ${position}
`;

export const Flex = styled(Box)`
  ${flexWrap}
  ${alignItems}
  ${flexDirection}
  ${justifyContent}
  display: ${({ inline }) => H.ifElse(inline, 'inline-flex', 'flex')};
`;

export const StyledObject = styled.object`
  ${width}
  ${height} 
`;

export const PositionedFlex = styled(Flex)`
  ${top}
  ${left}
  ${right}
  ${bottom}
  ${position}
`;

export const Text = styled.div`
  ${color}
  ${space}
  ${width}
  ${opacity}
  ${maxWidth}
  ${fontSize}
  ${textAlign}
  ${lineHeight}
  ${fontWeight}
  ${borderRadius}
  ${letterSpacing}
  cursor: ${({ cursor }) => R.or(cursor, 'initial')};
`;

export const Button = styled.button`
  ${color}
  ${space}
  ${width}
  ${height}
  ${border}
  ${zIndex}
  ${opacity}
  ${fontSize}
  ${boxShadow}
  ${borderColor}
  ${borderRadius}
  cursor: ${({ cursor }) => R.or(cursor, 'initial')};
`;

export const LinkButton = styled.a`
  ${color}
  ${space}
  ${width}
  ${height}
  ${border}
  ${zIndex}
  ${opacity}
  ${display}
  ${fontSize}
  ${position}
  ${boxShadow}
  ${alignItems}
  ${borderColor}
  ${borderRadius}
  ${justifyContent}
  cursor: ${({ cursor }) => R.or(cursor, 'initial')};
`;

/* NOTE: don't remove 'position' from start for work animation */
export const LinkButtonAnimated = styled(LinkButton)`
  position: relative;
  &::before {
    top: 0;
    left: 0;
    width: 0;
    content: '';
    height: 100%;
    position: absolute;
    transition: width 0.2s;
    background-color: rgba(255,255,255,0.5);
  }
  &:hover {
    &::before {
      width: 100%;
    }
  }
`;

export const Image = styled.img`
  ${space}
  ${width}
  ${height}
`;



export const ImagesContent = styled(Box)`
  justify-items: center;
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
  @media (min-width: 1200px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
`;

export const Header = styled.header`
  ${space}
  ${display}
  ${fontSize}
  ${alignItems}
  ${background}
`;

export const IconWrapper = styled(Box)`
  cursor: pointer;
`;

export const DropzoneWrapper = styled(Box)`
  border-style: ${({ withLogo }) => R.equals(withLogo, true) ? 'solid' : 'dashed'};
  & .dropzone {
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    position: absolute !important;
    & > p {
      display: ${({ withLogo }) => R.equals(withLogo, true) ? 'none' : 'block'};
    }
  }
`;

export const Label = styled.label`
  ${space}
  ${width}
  ${color}
  ${display}
  ${fontSize}
  &.required::after {
    content: '*';
    color: red;
  }
`;
export const Input = styled.input`
  ${space}
  ${width}
  ${height}
  ${border}
  ${fontSize}
  ${background}
  ${borderRadius}
  cursor: text;
  &:focus {
    box-shadow: 0 0 5px 0 rgba(206, 40, 40, 0.5);
  }
`;

export const SelectWrapper = styled(Box)`
  &:after {
    top: 24px;
    width: 6px;
    content: '';
    height: 6px;
    right: 30px;
    position: absolute;
    border: solid black;
    pointer-events: none;
    border-width: 0px 1px 1px 0;
    transform: rotate(45deg) translate(0, -60%);
  }
`;

export const SelectComponent = styled.select`
  ${space}
  ${width}
  ${height}
  ${border}
  ${fontSize}
  ${position}
  ${background}
  ${lineHeight}
  ${borderRadius}
  appearance: none;
  &:focus {
    box-shadow: 0 0 5px 0 rgba(206, 40, 40, 0.5);
  }
`;

