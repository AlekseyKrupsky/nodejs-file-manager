import process from "node:process";
import messagePrinter from "./messages.js";

export const exitManager = () => {
    messagePrinter.printThankYou();

    process.exit();
};
