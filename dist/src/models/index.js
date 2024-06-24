"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../config/database"));
const connectDatabase = async () => {
    try {
        const client = await database_1.default.connect();
        try {
            console.log('Database is Ready');
        }
        finally {
            client.release();
        }
    }
    catch (err) {
        console.error('Database connection error:', err.stack);
    }
};
exports.default = connectDatabase;
//# sourceMappingURL=index.js.map