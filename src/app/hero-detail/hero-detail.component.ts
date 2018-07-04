import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Hero } from '../hero';
import { GetHeroAction, UpdateHeroAction } from '../store/hero.actions';
import { selectCurrentHero } from '../store/heroes.reducer';
import { AppState } from '../store/reducers';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css']
})
export class HeroDetailComponent {
  hero: Observable<Hero>;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private store: Store<AppState>
  ) {
    const id = +this.route.snapshot.paramMap.get('id');
    store.dispatch(new GetHeroAction(id));

    this.hero = store.select(selectCurrentHero).pipe(
      // need a defensive copy to protect the store coming out
      map(hero => ({ ...hero }))
    );
  }

  goBack(): void {
    this.location.back();
  }

  save(hero: Hero): void {
    // need a defensive copy to protect the store going in
    this.store.dispatch(new UpdateHeroAction({ ...hero }));
    // this.store.dispatch(new UpdateHeroAction(hero));
    // setTimeout(() => hero.name = 'oops', 2000);
    this.goBack();
  }
}
