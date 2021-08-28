import firebase from "./";

export const persistence = firebase.auth.Auth.Persistence;

export const authModule = firebase.auth;

export default () => firebase.auth();
