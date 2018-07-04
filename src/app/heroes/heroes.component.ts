import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Hero } from '../hero';
import { AddHeroAction, DeleteHeroAction } from '../store/hero.actions';
import { selectAllHeroes } from '../store/heroes.reducer';
import { AppState } from '../store/reducers';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent {
  heroes: Observable<Hero[]>;

  constructor(private store: Store<AppState>) {
    this.heroes = store.select(selectAllHeroes);
  }

  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.store.dispatch(new AddHeroAction({ name } as Hero));
  }

  delete(hero: Hero): void {
    this.store.dispatch(new DeleteHeroAction(hero));
  }
}
