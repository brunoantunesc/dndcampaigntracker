import { Campaign } from "./Campaign";
import { Session } from "./Session"

export interface Arc {
    _id: string;
    name: string
    sessions: Session[]
    campaign: Campaign
}