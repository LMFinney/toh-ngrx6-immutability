import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
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
  styleUrls: ['./hero-detail.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroDetailComponent {
  hero: Observable<Partial<Hero>>;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private store: Store<AppState>
  ) {
    const id = +this.route.snapshot.paramMap.get('id');
    store.dispatch(new GetHeroAction(id));

    this.hero = store.select(selectCurrentHero).pipe(
      map(hero => hero ? hero.toJS() as Partial<Hero> : undefined)
    );
  }

  goBack(): void {
    this.location.back();
  }

  save(hero: Partial<Hero>): void {
    this.store.dispatch(new UpdateHeroAction(new Hero(hero)));
    this.goBack();
  }
}
