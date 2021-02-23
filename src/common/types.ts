import { WateredDayType } from './interfaces';

export type ContextProps = {
  isAuthenticated: boolean;
  user: any;
  loading: boolean;
  popupOpen: any;
  loginWithPopup: any;
  handleRedirectCallback: any;
  getIdTokenClaims: any;
  loginWithRedirect: any;
  getTokenSilently: any;
  getTokenWithPopup: any;
  logout: any;
};

export type RadolanDays = number[];

export type TreeLastWateredType = WateredDayType[];
