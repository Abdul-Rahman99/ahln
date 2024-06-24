"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const config_1 = __importDefault(require("../../config"));
const pool = new pg_1.Pool({
    host: config_1.default.DB_HOST,
    database: config_1.default.DB_NAME,
    user: config_1.default.DB_USER,
    password: config_1.default.DB_PASSWORD,
    port: parseInt(config_1.default.DB_PORT, 10),
    max: 4,
});
pool.on('connect', async () => {
    await console.log(`Connected to DB Postgres: ${config_1.default.DB_NAME}`);
});
pool.on('error', (error) => {
    console.error(error.message);
});
exports.default = pool;
//# sourceMappingURL=database.js.map