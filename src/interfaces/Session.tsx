export interface Session {
  _id: string;
  title: string;
  summary?: string;
  date: string;
  inGameDate?: string;
  campaign: {
    _id: string;
    name: string;
  };
  owner: string; // ou um objeto User se você popular
}