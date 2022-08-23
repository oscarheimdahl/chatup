export interface UserInitialState {
  loggedIn: boolean | null;
  token: string;
  login: {
    forbidden: boolean;
    serverUnreachable: boolean;
  };
}
