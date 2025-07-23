import { World } from "./World";

export interface Event {
  _id: string;
  title: string;
  summary?: string;
  inGameDate: string;
  world: World
}