import os from 'node:os';
import { printInvalidInput } from './messages.js';

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

export const operationSystem = async ([argument]) => {
    if (AVAILABLE_ARGUMENTS[argument] === undefined) {
        printInvalidInput();

        return;
    }

    if (typeof AVAILABLE_ARGUMENTS[argument] === "function") {
        console.log(AVAILABLE_ARGUMENTS[argument]());

        return;
    }

    console.log(AVAILABLE_ARGUMENTS[argument]);
};