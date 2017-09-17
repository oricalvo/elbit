export interface Contact {
  id: number;
  name: string;
}

export interface AppState {
  all: Contact[];
  contacts: Contact[];
}
