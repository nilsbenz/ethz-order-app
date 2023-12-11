import { AppUser, Claims, UserLevel } from "@order-app/types";
import { FirebaseError } from "firebase/app";
import {
  ParsedToken,
  User,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  sendEmailVerification,
  signInWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { Collection } from "./collections";
import { auth, db } from "./firebase";
import { appUserConverter } from "./model/users";

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

export async function getClaims(user?: User): Promise<ParsedToken & Claims> {
  if (!user) {
    return {};
  }
  const { claims } = await user.getIdTokenResult(true);
  return claims;
}

export function userLevelFromClaims(claims: Claims) {
  if (claims.superadmin) {
    return UserLevel.SuperAdmin;
  }
  if (claims.admin) {
    return UserLevel.Admin;
  }
  if (claims.waiter) {
    return UserLevel.Waiter;
  }
  return UserLevel.User;
}

export async function updateUserProfile(user: Partial<AppUser>) {
  const currentUser = auth.currentUser;
  if (currentUser) {
    if (user.displayName) {
      updateProfile(currentUser, { displayName: user.displayName });
    }
    await updateUser(currentUser.uid, user);
  }
}

export async function updateUser(userId: string, user: Partial<AppUser>) {
  if (user.displayName) {
    user.searchName = user.displayName.toLowerCase().replace(" ", "");
  }
  await updateDoc(
    doc(db, Collection.Users, userId).withConverter(appUserConverter),
    user
  );
}

export async function resetPassword(email: string) {
  try {
    await sendPasswordResetEmail(auth, email);
    return {
      success: true
    }
  } catch (e) {
    const error = e as FirebaseError;
    if (!error) {
      return { success: false };
    }
    return {
      success: false,
      message: "Bitte geben Sie eine gültige E-Mail-Adresse an"
    };
  }
}