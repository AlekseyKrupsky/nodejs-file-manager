import os from 'node:os';
import { argsCountValidator } from "./argsValidator.js";
import { INVALID_INPUT } from "./errors.js";

const getCPUInfo = () => {
    const cpus = os.cpus();

    let cpusInfo = `CPUs count is ${cpus.length}${os.EOL}`;

    cpus.forEach((cpu) => {
        cpusInfo += `Model: ${cpu.model}, clock rate: ${cpu.speed / 1000} GHz${os.EOL}`;
    });

    return cpusInfo;
};

const getUserName = () => {
    const userInfo = os.userInfo();

    return userInfo.username;
};

const AVAILABLE_ARGUMENTS = {
    '--EOL': os.EOL,
    '--cpus': getCPUInfo,
    '--homedir': os.homedir,
    '--username': getUserName,
    '--architecture': os.arch,
};

export const operationSystem = async (args) => {
    argsCountValidator(args, 1);

    const [argument] = args;

    if (AVAILABLE_ARGUMENTS[argument] === undefined) {
        throw new Error(INVALID_INPUT);
    }

    if (typeof AVAILABLE_ARGUMENTS[argument] === "function") {
        console.log(AVAILABLE_ARGUMENTS[argument]());

        return;
    }

    console.log(AVAILABLE_ARGUMENTS[argument]);
};