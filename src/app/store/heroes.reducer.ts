import { createFeatureSelector, createSelector } from '@ngrx/store';

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
  switch (action.type) {
    case HeroActionTypes.GetHeroSuccess: {
      return { ...state, selectedHeroId: action.payload.id };
    }
    case HeroActionTypes.DeleteHeroSuccess: {
      return {
        ...state,
        selectedHeroId: undefined,
        heroes: state.heroes.filter(hero => hero.id !== action.payload.id)
      };
    }
    case HeroActionTypes.LoadHeroesSuccess: {
      return { ...state, heroes: action.payload };
    }
    case HeroActionTypes.AddHeroSuccess: {
      return { ...state, heroes: [...state.heroes, action.payload] };
    }
    case HeroActionTypes.UpdateHeroSuccess: {
      const index = state.heroes
        .findIndex((hero: Hero) => hero.id === action.payload.id);
      if (index >= 0) {
        const heroes: Hero[] = state.heroes;
        return {
          ...state, heroes: [
            ...heroes.slice(0, index),
            action.payload,
            ...state.heroes.slice(index + 1)
          ]
        };
      }
      return state;
    }
    default: {
      return state;
    }
  }
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
