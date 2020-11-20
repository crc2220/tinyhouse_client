// type defs to be accessed in multiple parts of the client
// why not just use the generated one? -- revisit!
export interface Viewer {
  id: string | null;
  token: string | null;
  avatar: string | null;
  hasWallet: boolean | null;
  didRequest: boolean;
}
