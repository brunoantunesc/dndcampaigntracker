import { Campaign } from "./Campaign";

export interface Session {
  _id: string;
  title: string;
  summary?: string;
  date: string;
  inGameDate?: string;
  campaign: Campaign
  owner: string;
}