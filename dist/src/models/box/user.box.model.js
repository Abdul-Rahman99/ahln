"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../config/database"));
class UserBoxModel {
    async createUserBox(userBox) {
        try {
            const connection = await database_1.default.connect();
            const createdAt = new Date();
            const updatedAt = new Date();
            const userBoxId = `Ahln_${userBox.user_id}_${userBox.box_id}`;
            const sqlFields = ['id', 'user_id', 'box_id', 'createdAt', 'updatedAt'];
            const sqlParams = [
                userBoxId,
                userBox.user_id,
                userBox.box_id,
                createdAt,
                updatedAt,
            ];
            const sql = `INSERT INTO User_Box (${sqlFields.join(', ')}) 
                   VALUES (${sqlParams.map((_, index) => `$${index + 1}`).join(', ')}) 
                   RETURNING *`;
            const result = await connection.query(sql, sqlParams);
            connection.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Unable to create user box association: ${error.message}`);
        }
    }
    async getAllUserBoxes() {
        try {
            const connection = await database_1.default.connect();
            const sql = `
        SELECT ub.*, b.*
        FROM User_Box ub
        INNER JOIN Box b ON ub.box_id = b.id
      `;
            const result = await connection.query(sql);
            connection.release();
            return result.rows;
        }
        catch (error) {
            throw new Error(`Error retrieving user boxes with box details: ${error.message}`);
        }
    }
    async getUserBoxesByUserId(userId) {
        try {
            const connection = await database_1.default.connect();
            const sql = `
      SELECT ub.id as user_box_id,
      b.id as box_id,
      b.serial_number,
      b.box_label,
      b.box_model_id,
      b.address_id,
      b.current_tablet_id
      FROM User_Box ub
      INNER JOIN Box b ON ub.box_id = b.id
      WHERE ub.user_id = $1
    `;
            const result = await connection.query(sql, [userId]);
            connection.release();
            if (result.rows.length === 0) {
                throw new Error(`Could not find box for user with ID ${userId}`);
            }
            return result.rows;
        }
        catch (error) {
            throw new Error(`Error retrieving user boxes by user ID: ${error.message}`);
        }
    }
    async assignBoxToUser(userId, boxId) {
        try {
            if (!userId || !boxId) {
                throw new Error('Please provide a userId or boxId');
            }
            const connection = await database_1.default.connect();
            const userCheckSql = 'SELECT id FROM users WHERE id=$1';
            const userCheckResult = await connection.query(userCheckSql, [userId]);
            if (userCheckResult.rows.length === 0) {
                connection.release();
                throw new Error(`User with ID ${userId} does not exist`);
            }
            const boxCheckSql = 'SELECT id FROM box WHERE id=$1';
            const boxCheckResult = await connection.query(boxCheckSql, [boxId]);
            if (boxCheckResult.rows.length === 0) {
                connection.release();
                throw new Error(`Box with ID ${boxId} does not exist`);
            }
            const createdAt = new Date();
            const updatedAt = new Date();
            const userBoxId = `${userId}_${boxId}`;
            const sqlFields = ['id', 'user_id', 'box_id', 'createdAt', 'updatedAt'];
            const sqlParams = [userBoxId, userId, boxId, createdAt, updatedAt];
            const sql = `INSERT INTO User_Box (${sqlFields.join(', ')}) 
                 VALUES (${sqlParams.map((_, index) => `$${index + 1}`).join(', ')}) 
                 RETURNING *`;
            const result = await connection.query(sql, sqlParams);
            connection.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Unable to assign box to user: ${error.message}`);
        }
    }
    async getOne(id) {
        try {
            const sql = 'SELECT * FROM User_Box WHERE id=$1';
            const connection = await database_1.default.connect();
            const result = await connection.query(sql, [id]);
            connection.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Could not find UserBox ${id}: ${error.message}`);
        }
    }
    async updateOne(userBox, id) {
        try {
            const connection = await database_1.default.connect();
            const checkSql = 'SELECT * FROM User_Box WHERE id=$1';
            const checkResult = await connection.query(checkSql, [id]);
            if (checkResult.rows.length === 0) {
                throw new Error(`UserBox with ID ${id} does not exist`);
            }
            const queryParams = [];
            let paramIndex = 1;
            const updateFields = Object.keys(userBox)
                .map((key) => {
                if (userBox[key] !== undefined && key !== 'id') {
                    queryParams.push(userBox[key]);
                    return `${key}=$${paramIndex++}`;
                }
                return null;
            })
                .filter((field) => field !== null);
            queryParams.push(id);
            const sql = `UPDATE User_Box SET ${updateFields.join(', ')} WHERE id=$${paramIndex} RETURNING *`;
            const result = await connection.query(sql, queryParams);
            connection.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Could not update UserBox ${id}: ${error.message}`);
        }
    }
    async deleteOne(id) {
        try {
            const connection = await database_1.default.connect();
            const sql = `DELETE FROM User_Box WHERE id=$1 RETURNING *`;
            const result = await connection.query(sql, [id]);
            if (result.rows.length === 0) {
                throw new Error(`Could not find UserBox with ID ${id}`);
            }
            connection.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Could not delete UserBox ${id}: ${error.message}`);
        }
    }
    async getUserBoxesByBoxId(boxId) {
        try {
            const connection = await database_1.default.connect();
            const sql = `SELECT * FROM User_Box WHERE box_id=$1`;
            const result = await connection.query(sql, [boxId]);
            connection.release();
            return result.rows;
        }
        catch (error) {
            throw new Error(`Error fetching UserBoxes by box ID: ${error.message}`);
        }
    }
}
exports.default = UserBoxModel;
//# sourceMappingURL=user.box.model.js.map