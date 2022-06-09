import { INVALID_INPUT } from "./errors.js";

export const argsCountValidator = (args, expectedCount) => {
    if (args.length !== expectedCount) {
        throw new Error(INVALID_INPUT);
    }
};