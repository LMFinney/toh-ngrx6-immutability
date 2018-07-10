import { Action } from '@ngrx/store';
import { List } from 'immutable';

import { Hero } from '../hero';

export enum HeroActionTypes {
  LoadHeroes = '[Hero] Load Heroes',
  LoadHeroesSuccess = '[Hero] Load Heroes Success',
  GetHero = '[Hero] Get Hero',
  GetHeroSuccess = '[Hero] Get Hero Success',
  UpdateHero = '[Hero] Update Hero',
  UpdateHeroSuccess = '[Hero] Update Hero Success',
  AddHero = '[Hero] Add Hero',
  AddHeroSuccess = '[Hero] Add Hero Success',
  DeleteHero = '[Hero] Delete Hero',
  DeleteHeroSuccess = '[Hero] Delete Hero Success',
}

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 *
 * See Discriminated Unions: https://preview.tinyurl.com/discriminated-unions
 */
export class LoadHeroesAction implements Action {
  readonly type = HeroActionTypes.LoadHeroes;
}

export class LoadHeroesSuccessAction implements Action {
  readonly type = HeroActionTypes.LoadHeroesSuccess;

  constructor(readonly payload: List<Hero>) {
  }
}

export class GetHeroAction implements Action {
  readonly type = HeroActionTypes.GetHero;

  constructor(readonly payload: number) {
  }
}

export class GetHeroSuccessAction implements Action {
  readonly type = HeroActionTypes.GetHeroSuccess;

  constructor(readonly payload: Hero) {
  }
}

export class AddHeroAction implements Action {
  readonly type = HeroActionTypes.AddHero;

  constructor(readonly payload: Hero) {
  }
}

export class AddHeroSuccessAction implements Action {
  readonly type = HeroActionTypes.AddHeroSuccess;

  constructor(readonly payload: Hero) {
  }
}

export class UpdateHeroAction implements Action {
  readonly type = HeroActionTypes.UpdateHero;

  constructor(readonly payload: Hero) {
  }
}

export class UpdateHeroSuccessAction implements Action {
  readonly type = HeroActionTypes.UpdateHeroSuccess;

  constructor(readonly payload: Hero) {
  }
}

export class DeleteHeroAction implements Action {
  readonly type = HeroActionTypes.DeleteHero;

  constructor(readonly payload: Hero) {
  }
}

export class DeleteHeroSuccessAction implements Action {
  readonly type = HeroActionTypes.DeleteHeroSuccess;

  constructor(readonly payload: Hero) {
  }
}

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type HeroActionsUnion =
  | LoadHeroesAction
  | LoadHeroesSuccessAction
  | GetHeroAction
  | GetHeroSuccessAction
  | UpdateHeroAction
  | UpdateHeroSuccessAction
  | AddHeroAction
  | AddHeroSuccessAction
  | DeleteHeroAction
  | DeleteHeroSuccessAction;
