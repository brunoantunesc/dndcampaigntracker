import { Calendar } from "./Calendar"

export interface World {
    name: string
    description: string
    calendar: Calendar
    owner: string
    _id: string
}