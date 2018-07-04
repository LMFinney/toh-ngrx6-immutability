import { ActionReducerMap } from '@ngrx/store';

import { HeroState, heroReducer } from './heroes.reducer';

export interface AppState {
  heroes: HeroState;
}

export const reducers: ActionReducerMap<AppState> = {
  heroes: heroReducer
};
