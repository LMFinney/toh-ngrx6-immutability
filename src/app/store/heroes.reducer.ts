import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Patch, produce } from 'immer';

import { Hero } from '../hero';
import { HeroActionTypes, HeroActionsUnion } from './hero.actions';

export interface HeroState {
  heroes: Hero[];
  selectedHeroId?: number;
}

const initialState: HeroState = {
  heroes: []
};

export function heroReducer(
  state = initialState, action: HeroActionsUnion
): HeroState {
  return produce(state, draft => {
    switch (action.type) {
      case HeroActionTypes.GetHeroSuccess: {
        draft.selectedHeroId = action.payload.id;
        return draft;
      }
      case HeroActionTypes.DeleteHeroSuccess: {
        draft.selectedHeroId = undefined;
        draft.heroes = draft.heroes.filter(hero => hero.id !== action.payload.id);
        return draft;
      }
      case HeroActionTypes.LoadHeroesSuccess: {
        draft.heroes = action.payload;
        return draft;
      }
      case HeroActionTypes.AddHeroSuccess: {
        draft.heroes.push(action.payload);
        return draft;
      }
      case HeroActionTypes.UpdateHeroSuccess: {
        const index = draft.heroes
          .findIndex((hero: Hero) => hero.id === action.payload.id);
        if (index >= 0) {
          draft.heroes[index] = action.payload;
        }
        return draft;
      }
      default: {
        return draft;
      }
    }
  });
}

export const selectHeroState = createFeatureSelector<HeroState>('heroes');

const getSelectedHeroId = (state: HeroState) => state.selectedHeroId;

export const selectAllHeroes = createSelector(
  selectHeroState,
  state => state.heroes
);

const selectCurrentHeroId = createSelector(
  selectHeroState,
  getSelectedHeroId
);

export const selectCurrentHero = createSelector(
  selectAllHeroes,
  selectCurrentHeroId,
  (heroes, heroId) => {
    return heroes.find(hero => hero.id === heroId);
  }
);
