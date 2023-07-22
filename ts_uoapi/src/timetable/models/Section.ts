import { Component } from './Component';

export interface Section {
  //TODO
  room: string;
  instructor: string;
  day: string;
  start_time: string;
  end_time: string;
  start_date: string;
  end_date: string;

  //TODO
  year: string;
  label: string;
  term: Term;
  components: Component[]; // TODO
}

export type Term = 'fall' | 'summer' | 'winter';
