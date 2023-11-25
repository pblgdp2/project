import { createContext, useReducer } from "react";

export const AppContextDispatchProvider = createContext();
export const AppContextStateProvider = createContext();

const defaultState = {
  user: {},
  profile: {},
  isLoggedIn: false,
  isProfileAvailable: false,
  isProfileLoading: false,
  initialGetProfile: false,
  token: "",
  searchByCategory: [],
};

let initialState = {};

const localStorageState = localStorage.getItem("localstate");
if (localStorageState) {
  initialState = JSON.parse(localStorageState);
} else {
  initialState = defaultState;
}

const reducer = (state, action) => {
  const updatedState = (() => {
    switch (action.type) {
      case "LOGIN":
        return {
          ...state,
          isLoggedIn: true,
          token: action.payload.token,
          user: { ...action.payload, isAdmin: action.payload?.authorities === "ROLE_ADMIN" ? true : false },
        };
      case "LOGOUT":
        return {
          ...defaultState,
        };
      case "PROFILE_LOADING":
        return {
          ...state,
          isProfileLoading: action.payload,
        };
      case "PROFILE_UPDATE":
        return {
          ...state,
          isProfileAvailable: action.payload.available,
          profile: action.payload.data,
          initialGetProfile: true,
        };
      case "SEARCH_BY_CATEGORY":
        return {
          ...state,
          searchByCategory: action.payload,
        };
      default:
        return state;
    }
  })();

  localStorage.setItem("localstate", JSON.stringify(updatedState));
  return updatedState;
};

export default function AppContext({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContextDispatchProvider.Provider value={dispatch}>
      <AppContextStateProvider.Provider value={state}>{children}</AppContextStateProvider.Provider>
    </AppContextDispatchProvider.Provider>
  );
}
