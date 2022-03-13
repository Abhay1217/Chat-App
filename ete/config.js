const env = process.env;
// connect to mango db
const dbURI = 'mongodb://localhost/chat_app_ete';

export const nodeEnv = env.NODE_ENV || 'dev';
export default {
    port: env.port || 8080,
    dbURI: dbURI,
    secret: 'secret!'
};
