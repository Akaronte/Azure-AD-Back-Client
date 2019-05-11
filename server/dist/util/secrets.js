"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
if (fs_1.default.existsSync('.env')) {
    console.log('Using .env file to supply config environment variables');
    dotenv_1.default.config({ path: '.env' });
}
else {
    console.log('no .env found');
}
if (process.env.APP_SECRET) {
    console.log('APP_SECRET: ' + process.env.APP_SECRET);
}
else {
    console.log('APP_SECRET not found');
    process.exit(1);
}
if (process.env.APP_ID) {
    console.log('APP_ID: ' + process.env.APP_ID);
}
else {
    console.log('APP_ID not found');
    process.exit(1);
}
if (process.env.TENANT) {
    console.log('TENANT: ' + process.env.TENANT);
}
else {
    console.log('TENANT not found');
    process.exit(1);
}
if (process.env.HOST_URL) {
    console.log('HOST_URL: ' + process.env.HOST_URL);
}
else {
    console.log('HOST_URL not found');
    process.exit(1);
}
if (process.env.SESSION_SECRET) {
    console.log('SESSION_SECRET' + process.env.SESSION_SECRET);
}
else {
    console.log('SESSION_SECRET not found');
    process.exit(1);
}
if (process.env.PORT) {
    console.log('PORT: ' + process.env.PORT);
}
else {
    console.log('PORT not found');
    process.exit(1);
}
if (process.env.URL_FRONTEND) {
    console.log('URL_FRONTEND: ' + process.env.URL_FRONTEND);
}
else {
    console.log('URL_FRONTEND not found');
    process.exit(1);
}
exports.APP_SECRET = process.env.APP_SECRET;
exports.APP_ID = process.env.APP_ID;
exports.TENANT = process.env.TENANT;
exports.HOST_URL = process.env.HOST_URL;
exports.SESSION_SECRET = process.env.SESSION_SECRET;
exports.PORT = process.env.PORT;
exports.URL_FRONTEND = process.env.URL_FRONTEND;
