import {AppState} from "../app.state";

export function filter(state: AppState, searchStr: string): AppState {
  if(!searchStr) {
    return {
      ... state,
      contacts: state.all,
    };
  }

  return {
    ... state,
    contacts: state.all.filter(c => c.name.toLowerCase().indexOf(searchStr.toLowerCase())!=-1)
  };
}
