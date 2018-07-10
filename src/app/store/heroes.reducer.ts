import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { List } from 'immutable';

import { Hero } from '../hero';
import { HeroActionTypes, HeroActionsUnion } from './hero.actions';

export interface HeroState extends EntityState<Partial<Hero>> {
  selectedHeroId?: number;
}

export const adapter: EntityAdapter<Partial<Hero>> =
  createEntityAdapter<Partial<Hero>>({
    sortComparer: false,
  });

export const initialState: HeroState = adapter.getInitialState({
  selectedHeroId: undefined,
});

export function heroReducer(
  state = initialState, action: HeroActionsUnion
): HeroState {
  switch (action.type) {
    case HeroActionTypes.GetHeroSuccess: {
      return { ...state, selectedHeroId: action.payload.id };
    }
    case HeroActionTypes.DeleteHeroSuccess: {
      return adapter.removeOne(
        action.payload.id,
        { ...state, selectedHeroId: undefined }
      );
    }
    case HeroActionTypes.LoadHeroesSuccess: {
      return adapter.addAll(
        action.payload.toArray().map(hero => hero.toJS()),
        state
      );
    }
    case HeroActionTypes.AddHeroSuccess: {
      return adapter.addOne(action.payload.toJS(), state);
    }
    case HeroActionTypes.UpdateHeroSuccess: {
      return adapter.updateOne(
        { id: action.payload.id, changes: action.payload.toJS() },
        state
      );
    }
    default: {
      return state;
    }
  }
}

// get the selectors
const { selectEntities, selectAll } = adapter.getSelectors();

export const selectHeroState = createFeatureSelector<HeroState>('heroes');

const getSelectedHeroId = (state: HeroState) => state.selectedHeroId;

const selectAllHeroesArray = createSelector(
  selectHeroState,
  selectAll,
);

export const selectAllHeroes = createSelector(
  selectAllHeroesArray,
  params => {
    return List(params.map(param => new Hero(param)));
  }
);

const selectCurrentHeroId = createSelector(
  selectHeroState,
  getSelectedHeroId
);

const selectHeroEntities = createSelector(
  selectHeroState,
  selectEntities
);

export const selectCurrentHero = createSelector(
  selectHeroEntities,
  selectCurrentHeroId,
  (heroEntities, heroId) => {
    return new Hero(heroEntities[heroId]);
  }
);
