import dotenv from 'dotenv';
import fs from 'fs';

if (fs.existsSync('.env')) {
    console.log('Using .env file to supply config environment variables');
    dotenv.config({ path: '.env' });
} else {
    console.log('no .env found')
}

if (process.env.APP_SECRET) {
    console.log('APP_SECRET: '+process.env.APP_SECRET);
} else {
    console.log('APP_SECRET not found');
    process.exit(1);
}

if (process.env.APP_ID) {
    console.log('APP_ID: '+process.env.APP_ID);
} else {
    console.log('APP_ID not found');
    process.exit(1);
}

if (process.env.TENANT) {
    console.log('TENANT: '+process.env.TENANT);
} else {
    console.log('TENANT not found');
    process.exit(1);
}

if (process.env.HOST_URL) {
    console.log('HOST_URL: '+process.env.HOST_URL);
}else{
    console.log('HOST_URL not found');
    process.exit(1);
}

if (process.env.SESSION_SECRET) {
    console.log('SESSION_SECRET'+process.env.SESSION_SECRET);
}else{
    console.log('SESSION_SECRET not found');
    process.exit(1);
}

if (process.env.PORT) {
    console.log('PORT: '+process.env.PORT);
}else{
    console.log('PORT not found');
    process.exit(1);
}

if (process.env.URL_FRONTEND) {
    console.log('URL_FRONTEND: '+process.env.URL_FRONTEND);
}else{
    console.log('URL_FRONTEND not found');
    process.exit(1);
}

export const APP_SECRET = <string>process.env.APP_SECRET; 
export const APP_ID = <string>process.env.APP_ID;
export const TENANT = <string>process.env.TENANT;
export const HOST_URL = <string>process.env.HOST_URL;
export const SESSION_SECRET = <string>process.env.SESSION_SECRET;
export const PORT= <string>process.env.PORT;
export const URL_FRONTEND= <string>process.env.URL_FRONTEND;
