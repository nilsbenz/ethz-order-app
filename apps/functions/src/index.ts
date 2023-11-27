import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import {
  deleteUserData,
  handleAssignUserToCompany,
  handleUpdateSuperAdminStatus,
  initUserData,
} from "./auth";

const REGION = "europe-west1";

admin.initializeApp();

export const updateSuperAdminStatus = functions
  .region(REGION)
  .https.onCall(handleUpdateSuperAdminStatus);

export const assignUserToCompany = functions
  .region(REGION)
  .https.onCall(handleAssignUserToCompany);

export const handleUserCreate = functions.auth.user().onCreate(initUserData);

export const handleUserDelete = functions.auth.user().onDelete(deleteUserData);
