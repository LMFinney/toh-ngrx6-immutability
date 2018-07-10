import { createFeatureSelector, createSelector } from '@ngrx/store';
import { List, Record } from 'immutable';

import { Hero } from '../hero';
import { HeroActionTypes, HeroActionsUnion } from './hero.actions';

export class HeroState extends Record({
  heroes: List(),
  selectedHeroId: undefined
}) {
  readonly heroes: List<Hero>;
  readonly selectedHeroId?: number;

  assign(values: Partial<HeroState>) {
    return this.merge(values) as this;
  }
}

const initialState = new HeroState();

export function heroReducer(
  state = initialState, action: HeroActionsUnion
): HeroState {
  switch (action.type) {
    case HeroActionTypes.GetHeroSuccess: {
      return state.assign({ selectedHeroId: action.payload.id });
    }
    case HeroActionTypes.DeleteHeroSuccess: {
      const index = findHeroIndex(state, action.payload.id);
      if (index >= 0) {
        return state.assign({
          selectedHeroId: undefined,
          heroes: state.heroes.remove(index)
        });
      } else {
        return state;
      }
    }
    case HeroActionTypes.LoadHeroesSuccess: {
      return state.assign({ heroes: action.payload });
    }
    case HeroActionTypes.AddHeroSuccess: {
      return state.assign({ heroes: state.heroes.push(action.payload) });
    }
    case HeroActionTypes.UpdateHeroSuccess: {
      const index = findHeroIndex(state, action.payload.id);
      if (index >= 0) {
        return state.assign({
          heroes: state.heroes.set(index, action.payload)
        });
      }
      return state;
    }
    case HeroActionTypes.DeleteHeroSuccess: {
      const index = findHeroIndex(state, action.payload.id);
      if (index >= 0) {
        return state.assign({ heroes: state.heroes.remove(index) });
      }
      return state;
    }
    default: {
      return state;
    }
  }
}

function findHeroIndex(state: HeroState, id: number): number {
  return state.heroes.findIndex((hero: Hero) => hero.id === id);
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
