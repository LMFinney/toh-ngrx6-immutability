import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { List } from 'immutable';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Hero } from './hero';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({ providedIn: 'root' })
export class HeroService {

  private heroesUrl = 'api/heroes';  // URL to web api

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  /** GET heroes from the server */
  getHeroes(): Observable<List<Hero>> {
    return this.http.get<Partial<Hero>[]>(this.heroesUrl)
      .pipe(
        map(params => List(params.map(param => new Hero(param)))),
        tap(heroes => this.log(`fetched heroes`))
      );
  }

  /** GET hero by id. Return `undefined` when id not found */
  getHeroNo404(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/?id=${id}`;
    return this.http.get<Partial<Hero>[]>(url)
      .pipe(
        map(heroes => new Hero(heroes[0])), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} hero id=${id}`);
        }),
        catchError(this.handleError<Hero>(`getHero id=${id}`))
      );
  }

  /** GET hero by id. Will 404 if id not found */
  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Partial<Hero>>(url).pipe(
      map(param => new Hero(param)),
      tap(_ => this.log(`fetched hero id=${id}`))
    );
  }

  /* GET heroes whose name contains search term */
  searchHeroes(term: string): Observable<List<Hero>> {
    if (!term.trim()) {
      // if not search term, return empty hero list.
      return of(List.of());
    }
    return this.http.get<Partial<Hero>[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      map(params => List(params.map(param => new Hero(param)))),
      tap(_ => this.log(`found heroes matching "${term}"`)),
      catchError(this.handleError<List<Hero>>('searchHeroes', List.of()))
    );
  }

  //////// Save methods //////////

  /** POST: add a new hero to the server */
  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Partial<Hero>>(this.heroesUrl, hero, httpOptions).pipe(
      map(param => new Hero(param)),
      tap((created: Hero) => this.log(`added hero w/ id=${created.id}`))
    );
  }

  /** DELETE: delete the hero from the server */
  deleteHero(hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Partial<Hero>>(url, httpOptions).pipe(
      map(param => new Hero(param)),
      tap(_ => console.log(`deleted hero id=${id}`))
    );
  }

  /** PUT: update the hero on the server */
  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add('HeroService: ' + message);
  }
}
