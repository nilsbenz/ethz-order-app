import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { handleUpdateSuperAdminStatus } from "./auth";

const REGION = "europe-west1";

admin.initializeApp();

export const updateSuperAdminStatus = functions
  .region(REGION)
  .https.onCall(handleUpdateSuperAdminStatus);
