import { World } from "./World"

export interface Character {
    name: string
    race: string
    characterClass: string
    subclass?: string
    birthDate: string
    level: number
    world: World
    _id: string
}