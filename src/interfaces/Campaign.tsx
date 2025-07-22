import { World } from "./World"
import { Arc } from "./Arc"

export interface Campaign {
    name: string
    startDate: string
    endDate?: string
    arcs?: Arc[]
    characters?: []
    world: World
    _id: string
}