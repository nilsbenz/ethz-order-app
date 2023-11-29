import * as admin from "firebase-admin";
import { UserRecord } from "firebase-admin/lib/auth/user-record";
import * as functions from "firebase-functions";

export async function handleUpdateSuperAdminStatus(
  { userId, isSuperAdmin }: { userId: string; isSuperAdmin: boolean },
  context: functions.https.CallableContext
): Promise<void> {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "This function is restricted to authenticated users."
    );
  }
  if (!context.auth.token.superadmin) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "This function is restricted to admins."
    );
  }
  if (context.auth.uid === userId) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "It is not possible to change one's own access level."
    );
  }
  const updateClaims = {
    superadmin: isSuperAdmin,
  };
  await admin.auth().setCustomUserClaims(userId, updateClaims);
}

export async function handleAssignUserToEntity(
  {
    userId,
    entity,
    level,
    validUntil,
  }: {
    userId: string;
    entity: string | null;
    level: number;
    validUntil?: number;
  },
  context: functions.https.CallableContext
) {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "This function is restricted to authenticated users."
    );
  }
  if (
    !context.auth.token.superadmin &&
    (!context.auth.token.admin || context.auth.token.admin !== entity)
  ) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "This function is restricted to admins."
    );
  }
  if (context.auth.uid === userId) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "It is not possible to change one's own access level."
    );
  }
  const updateClaims = {
    [level === 5 ? "admin" : "waiter"]: entity ?? undefined,
    validUntil,
  };
  await admin.auth().setCustomUserClaims(userId, updateClaims);
}

export async function initUserData(user: UserRecord): Promise<void> {
  const userData = {
    displayName: "",
    searchName: "",
    photoUrl: "",
    level: 1,
    company: null,
    event: null,
    validUntil: null,
  };
  admin.firestore().collection("users").doc(user.uid).set(userData);
}

export async function deleteUserData(user: UserRecord): Promise<void> {
  const userDataRef = admin.firestore().collection("users").doc(user.uid);
  await userDataRef.delete();
}
