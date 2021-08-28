import firebase from "./";

export const persistence = firebase.auth.Auth.Persistence;

export default () => firebase.auth();
