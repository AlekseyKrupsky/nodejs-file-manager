import process from "node:process";
import { printThankYou } from "./messages.js";

export const exitManager = () => {
    printThankYou();

    process.exit();
};