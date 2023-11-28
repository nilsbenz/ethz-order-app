import { Company, Event } from "@order-app/types";
import { createSimpleConverter } from "./common";

export const companyConverter = createSimpleConverter<Company>();
export const eventConverter = createSimpleConverter<Event>();
