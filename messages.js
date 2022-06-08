import { cwd } from "node:process";

const printInvalidInput = () => {
    console.log('Invalid input');
};

const printOperationFailed = () => {
    console.log('Operation failed');
};

const printWelcome = () => {
    console.log(`Welcome to the File Manager, ${global.username}!`);
};

const printCurrentDir = () => {
    console.log(`You are currently in ${cwd()}`);
};

const printThankYou = () => {
    console.log(`Thank you for using File Manager, ${global.username}!`);
};

export { printOperationFailed, printInvalidInput, printWelcome, printThankYou, printCurrentDir };