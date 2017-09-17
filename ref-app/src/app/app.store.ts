import {createStore, Dispatch, Reducer, Store, Unsubscribe} from "redux";
import {AppState} from "./app.state";
import {filter} from "./reducers/contact.reducer";

function reducer(state: AppState, action): AppState {
  if(state == undefined) {
    const all = [
      {id:1, name: "Ori"},
      {id:2, name: "Roni"},
    ];

    return {
      all,
      contacts: all,
    }
  }

  if(action.type == "FILTER") {
    return filter(state, action.searchStr);
  }

  return state;
}

export abstract class AppStore implements Store<AppState> {
  dispatch: Dispatch<AppState>;
  abstract getState(): AppState;
  abstract subscribe(listener: () => void): Unsubscribe;
  abstract replaceReducer(nextReducer: Reducer<AppState>): void;
}

export const appStore: AppStore = createStore(reducer);
