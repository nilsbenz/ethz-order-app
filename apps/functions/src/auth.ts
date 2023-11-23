import * as admin from "firebase-admin";
import { UserRecord } from "firebase-admin/lib/auth/user-record";
import * as functions from "firebase-functions";

export const handleUpdateSuperAdminStatus = async (
  { userId, isSuperAdmin }: { userId: string; isSuperAdmin: boolean },
  context: functions.https.CallableContext
): Promise<void> => {
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
};

export const initUserData = async (user: UserRecord): Promise<void> => {
  const userData = {
    displayName: "",
    photoUrl: "",
    level: 1,
  };
  admin.firestore().collection("users").doc(user.uid).set(userData);
};

export const deleteUserData = async (user: UserRecord): Promise<void> => {
  const userDataRef = admin.firestore().collection("users").doc(user.uid);
  await userDataRef.delete();
};
