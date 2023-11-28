import { AppUser } from "@order-app/types";
import { createSimpleConverter } from "./common";

export const appUserConverter = createSimpleConverter<AppUser>();
