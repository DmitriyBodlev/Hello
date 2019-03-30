import * as R from 'ramda';
import styled, { css, createGlobalStyle } from 'styled-components';
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
  fontFamily,
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

export const GlobalStyle = createGlobalStyle`
  body, ul, button {
    margin: 0;
    padding: 0;
    font-family: sans-serif;
  }
  * {
    box-sizing: border-box;
    margin: 0;
  }
  h1, h2, h3, h4, h5, h6, p {
    margin: 0;
    font-weight: 400;
  }
  a {
    color: inherit;
    text-decoration: none;
  }
  * :active, :hover, :focus {
    outline: 0;
    outline-offset: 0;
  }
  *::-webkit-scrollbar-track
  {
    background-color: transparent;
  }

  *::-webkit-scrollbar
  {
    width: 8px;
    height: 8px;
  }

  *::-webkit-scrollbar-thumb
  {
    background-color: lightblue;
  }
`

export const createMinWithMediaQuery = n => `
  @media screen and (min-width: ${n}px)
`;

export const createMaxWithMediaQuery = n => `
  @media screen and (max-width: ${n}px)
`;

export const hoverStyles = css`
  &:hover {
    color: ${({ hoverColor }) => hoverColor};
    background-color: ${({ hoverBg }) => hoverBg};
  }
`

export const mediaPhoneStyles = css`
  ${createMaxWithMediaQuery(500)} {
    display: ${({ phoneDisplay }) => phoneDisplay};
  }
`

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
  ${maxWidth}
  ${minWidth}
  ${textAlign}
  ${maxHeight}
  ${minHeight}
  ${boxShadow}
  ${borderTop}
  ${fontFamily}
  ${lineHeight}
  ${borderLeft}
  ${borderRight}
  ${borderColor}
  ${borderBottom}
  ${borderRadius}
  transform: ${({ transform }) => transform};
  transition: ${({ transition }) => transition};
  border-style: ${({ borderStyle }) => borderStyle};
  text-transform: ${({ textTransform }) => textTransform};
  cursor: ${({ cursor }) => R.or(cursor, 'initial')};
  ${({ additionalStyles }) => additionalStyles};
  ${mediaPhoneStyles}
`;

export const Flex = styled(Box)`
  ${flexWrap}
  ${alignItems}
  ${flexDirection}
  ${justifyContent}
  display: ${({ inline }) => H.ifElse(inline, 'inline-flex', 'flex')};
`;

export const PositionedBox = styled(Box)`
  ${top}
  ${left}
  ${right}
  ${bottom}
  ${position}
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
  ${fontWeight}
  ${borderColor}
  ${borderRadius}
  cursor: ${({ cursor }) => R.or(cursor, 'initial')};
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

export const Label = styled.label`
  ${space}
  ${width}
  ${color}
  ${display}
  ${fontSize}
  ${alignItems}
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
  ${minWidth}
  ${fontSize}
  ${background}
  ${borderRadius}
  cursor: text;
  &:focus {
    box-shadow: 0 0 5px 0 rgba(206, 40, 40, 0.5);
  }
`;

export const SelectWrapper = styled(PositionedBox)`
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
