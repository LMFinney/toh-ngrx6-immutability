import {Record} from 'immutable';

// export interface MutableHero {
//   id: number;
//   name: string;
// }

export class Hero extends Record({id: undefined, name: undefined}) {
  readonly id: number;
  readonly name: string;

  constructor(params?: Partial<Hero>) {
    params ? super(params) : super();
  }
}
