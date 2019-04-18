import { Action } from '../generators/actions';

export type GeneratorFunction = IterableIterator<Action | Action[]> | AsyncIterableIterator<Action | Action[]>;
