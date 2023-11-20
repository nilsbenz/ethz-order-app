import { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  sendEmailVerification,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "./firebase";

const MESSAGES = {
  "auth/invalid-login-credentials":
    "Der Benutzername oder das Passwort sind ungültig.",
  "auth/wrong-password": "Der Benutzername oder das Passwort sind ungültig.",
  "auth/user-not-found": "Der Benutzername oder das Passwort sind ungültig.",
  "auth/invalid-email": "Diese Mailadresse existiert nicht.",
  "auth/email-already-in-use": "Diese Mailadresse ist bereits vergeben.",
  "auth/weak-password":
    "Dieses Passwort ist zu schwach. Bitte verwende mindestens 6 Zeichen.",
  "auth/expired-action-code": "Dieser Authentifizierungstoken ist abgelaufen.",
  "auth/invalid-action-code": "Dieser Authentifizierungstoken ist ungültig.",
} as const;

export async function register(email: string, password: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    sendEmailVerification(user);
    return {
      success: true,
    };
  } catch (e) {
    const error = e as FirebaseError;
    if (!error) {
      return { success: false };
    }
    return {
      success: false,
      message: MESSAGES[error.code as keyof typeof MESSAGES] ?? undefined,
    };
  }
}

export async function login(email: string, password: string) {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return {
      success: true,
    };
  } catch (e) {
    const error = e as FirebaseError;
    if (!error) {
      return { success: false };
    }
    return {
      success: false,
      message: MESSAGES[error.code as keyof typeof MESSAGES] ?? undefined,
    };
  }
}

export async function signOut() {
  try {
    await fbSignOut(auth);
    return {
      success: true,
    };
  } catch (e) {
    const error = e as FirebaseError;
    if (!error) {
      return { success: false };
    }
    return {
      success: false,
      message: MESSAGES[error.code as keyof typeof MESSAGES] ?? undefined,
    };
  }
}
