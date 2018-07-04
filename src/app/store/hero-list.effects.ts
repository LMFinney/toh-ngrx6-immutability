import { Injectable } from '@angular/core';
import { Actions, Effect, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { EMPTY, Observable } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { MessageService } from '../message.service';
import {
  AddHeroAction,
  AddHeroSuccessAction,
  DeleteHeroAction,
  DeleteHeroSuccessAction,
  GetHeroAction,
  GetHeroSuccessAction,
  HeroActionTypes,
  LoadHeroesSuccessAction,
  UpdateHeroAction,
  UpdateHeroSuccessAction
} from './hero.actions';

@Injectable()
export class HeroListEffects {
  constructor(
    private actions: Actions,
    private svc: HeroService,
    private messageService: MessageService,
  ) { }

  @Effect({ dispatch: false }) all = this.actions.pipe(
    map(action => console.log({ action })));

  @Effect() loadHeroes = this.actions
    .ofType(ROOT_EFFECTS_INIT).pipe(
      mergeMap(() => this.svc.getHeroes().pipe(
        map(heroes => new LoadHeroesSuccessAction(heroes)),
        catchError(this.handleError<Hero>('getHeroes'))
      ))
    );

  @Effect() getHero = this.actions
    .ofType(HeroActionTypes.GetHero).pipe(
      map((action: GetHeroAction) => action.payload),
      switchMap(id => this.svc.getHero(id).pipe(
        map(hero => new GetHeroSuccessAction(hero)),
        catchError(this.handleError<Hero>(`getHero id=${id}`))))
    );

  @Effect() addHero = this.actions
    .ofType(HeroActionTypes.AddHero).pipe(
      map((action: AddHeroAction) => action.payload),
      mergeMap(hero => this.svc.addHero(hero).pipe(
        map(created => new AddHeroSuccessAction(created)),
        catchError(this.handleError<Hero>('addHero'))
      ))
    );

  @Effect() updateHero = this.actions
    .ofType(HeroActionTypes.UpdateHero).pipe(
      map((action: UpdateHeroAction) => action.payload),
      mergeMap(hero => this.svc.updateHero(hero).pipe(
        map(_ => new UpdateHeroSuccessAction(hero)),
        catchError(this.handleError<any>('updateHero'))
      ))
    );

  @Effect() deleteHero = this.actions
    .ofType(HeroActionTypes.DeleteHero).pipe(
      map((action: DeleteHeroAction) => action.payload),
      mergeMap(hero => this.svc.deleteHero(hero).pipe(
        map(_ => new DeleteHeroSuccessAction(hero)),
        catchError(this.handleError<Hero>('deleteHero'))
      )),
  );

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   *
   * @param operation - name of the operation that failed
   */
  private handleError<T>(operation = 'operation') {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error({ error }); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return EMPTY;
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add('HeroListEffects: ' + message);
  }
}
