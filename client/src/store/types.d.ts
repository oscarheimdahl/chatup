export interface UserInitialState {
  loggedIn: boolean | null;
  token: string;
  loginError: {
    forbidden: boolean;
    serverUnreachable: boolean;
  };
  registerInfo: {
    usernameTaken: boolean;
    success: boolean;
  };
}
