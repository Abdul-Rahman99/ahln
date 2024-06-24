"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("./database"));
async function patchDatabase() {
    const client = await database_1.default.connect();
    try {
        await client.query('BEGIN');
        const updateQuery = `
      UPDATE your_table
      SET column1 = $1, column2 = $2
      WHERE id = $3
    `;
        const values = ['new_value1', 'new_value2', 123];
        await client.query(updateQuery, values);
        await client.query('COMMIT');
        console.log('Database patched successfully!');
    }
    catch (err) {
        await client.query('ROLLBACK');
        console.error('Error patching database:', err);
    }
    finally {
        client.release();
    }
}
exports.default = patchDatabase;
//# sourceMappingURL=patch.js.map