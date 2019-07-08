import * as R from 'ramda';
import shortid from 'shortid';
// constants
import * as GC from '../constants';
//  /////////////////////////////////////////////////////////////////////////////////////////////////

// ADDITION RAMDA HELPERS
export const isTrue = (value) => R.equals(value, true);
export const isFalse = (value) => R.equals(value, false);
export const isNotNil = R.complement(R.isNil);
export const notEquals = R.complement(R.equals);
export const isNotEmpty = R.complement(R.isEmpty);
export const isNotNilAndNotEmpty = (value) => R.and(isNotNil(value), isNotEmpty(value));
export const isNilOrEmpty = (value) => R.or(R.isNil(value), R.isEmpty(value));
export const isAllTrue = R.all(isTrue);
export const isAllFalse = R.all(isFalse);
export const notContains = R.complement(R.contains);

export const getItemFromLocalStorage = (itemName) => localStorage.getItem(itemName);
export const setItemToLocalStorage = (itemName, itemValue) => localStorage.setItem(itemName, itemValue);

export const ifElse = (predicate, ifSt, elseSt) => {
  if (predicate) return ifSt;
  return elseSt;
};

export const genShortId = () => shortid.generate();

export const getLocaleItem = (path, locale) => R.pathOr('', path, locale);

// TODO: remove it if below solution works properly
// export const isBrowser = new Function('try {return this===window;}catch(e){ return false;}'); // eslint-disable-line

export const isBrowser = typeof window === 'object'
  && typeof document === 'object'
  && document.nodeType === 9;

export const getLocationPathname = () => {
  if (isBrowser) {
    return window.location.pathname;
  }
  return GC.ROUTE_HOME;
};

export const shouldReturn = (willExportPDF, content) => {
  if (willExportPDF) {
    return null;
  }
  return content;
};
