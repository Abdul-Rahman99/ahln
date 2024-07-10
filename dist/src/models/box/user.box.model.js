"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../config/database"));
const user_model_1 = __importDefault(require("../users/user.model"));
const user = new user_model_1.default();
class UserBoxModel {
    async createUserBox(userBox) {
        const connection = await database_1.default.connect();
        try {
            const createdAt = new Date();
            const updatedAt = new Date();
            const userBoxId = `${userBox.user_id}_${userBox.box_id}`;
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
            return result.rows[0];
        }
        catch (error) {
            throw new Error(error.message);
        }
        finally {
            connection.release();
        }
    }
    async getAllUserBoxes() {
        const connection = await database_1.default.connect();
        try {
            const sql = `
        SELECT ub.*, b.*
        FROM User_Box ub
        INNER JOIN Box b ON ub.box_id = b.id
      `;
            const result = await connection.query(sql);
            return result.rows;
        }
        catch (error) {
            throw new Error(`Error retrieving user boxes with box details: ${error.message}`);
        }
        finally {
            connection.release();
        }
    }
    async getUserBoxesByUserId(userId) {
        const connection = await database_1.default.connect();
        try {
            const sql = `
      SELECT
        ub.id AS user_box_id,
        b.id AS id,
        b.serial_number,
        b.box_label AS name,
        b.box_model_id,
        a.district,
        a.city,
        a.building_number,
        b.current_tablet_id
      FROM
        User_Box ub
        INNER JOIN Box b ON ub.box_id = b.id
        LEFT JOIN Address a ON b.address_id = a.id
      WHERE
        ub.user_id = $1
    `;
            const result = await connection.query(sql, [userId]);
            return result.rows;
        }
        catch (error) {
            throw new Error(error.message);
        }
        finally {
            connection.release();
        }
    }
    async assignBoxToUser(userId, boxId) {
        const connection = await database_1.default.connect();
        try {
            if (!userId || !boxId) {
                throw new Error('Please provide a userId or boxId');
            }
            const userCheckSql = 'SELECT id FROM users WHERE id=$1';
            const userCheckResult = await connection.query(userCheckSql, [userId]);
            if (userCheckResult.rows.length === 0) {
                throw new Error(`User with ID ${userId} does not exist`);
            }
            const boxCheckSql = 'SELECT id FROM box WHERE id=$1';
            const boxCheckResult = await connection.query(boxCheckSql, [boxId]);
            if (boxCheckResult.rows.length === 0) {
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
            return result.rows[0];
        }
        catch (error) {
            throw new Error(error.message);
        }
        finally {
            connection.release();
        }
    }
    async getOne(id) {
        const connection = await database_1.default.connect();
        try {
            const sql = 'SELECT * FROM User_Box WHERE id=$1';
            const result = await connection.query(sql, [id]);
            return result.rows[0];
        }
        catch (error) {
            throw new Error(error.message);
        }
        finally {
            connection.release();
        }
    }
    async updateOne(userBox, id) {
        const connection = await database_1.default.connect();
        try {
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
            return result.rows[0];
        }
        catch (error) {
            throw new Error(error.message);
        }
        finally {
            connection.release();
        }
    }
    async deleteOne(id) {
        const connection = await database_1.default.connect();
        try {
            const sql = `DELETE FROM User_Box WHERE id=$1 RETURNING *`;
            const result = await connection.query(sql, [id]);
            if (result.rows.length === 0) {
                throw new Error(`Could not find UserBox with ID ${id}`);
            }
            return result.rows[0];
        }
        catch (error) {
            throw new Error(error.message);
        }
        finally {
            connection.release();
        }
    }
    async getUserBoxesByBoxId(boxId) {
        const connection = await database_1.default.connect();
        try {
            const sql = `SELECT * FROM User_Box WHERE box_id=$1`;
            const result = await connection.query(sql, [boxId]);
            return result.rows;
        }
        catch (error) {
            throw new Error(error.message);
        }
        finally {
            connection.release();
        }
    }
    async userAssignBoxToHimslef(userId, serialNumber) {
        const connection = await database_1.default.connect();
        try {
            if (!userId || !serialNumber) {
                throw new Error('Please provide a userId or serialNumber');
            }
            const userCheckSql = 'SELECT id FROM users WHERE id=$1';
            const userCheckResult = await connection.query(userCheckSql, [userId]);
            if (userCheckResult.rows.length === 0) {
                throw new Error(`User with ID ${userId} does not exist`);
            }
            const boxCheckSql = 'SELECT id FROM box WHERE serial_number=$1';
            const boxCheckResult = await connection.query(boxCheckSql, [
                serialNumber,
            ]);
            if (boxCheckResult.rows.length === 0) {
                throw new Error(`Box with Serial Number ${serialNumber} does not exist`);
            }
            const userBoxCheckSql = 'SELECT box_id FROM User_Box WHERE box_id=$1';
            const userBoxCheckResult = await connection.query(userBoxCheckSql, [
                boxCheckResult.rows[0].id,
            ]);
            if (userBoxCheckResult.rows.length > 0) {
                throw new Error(`Box ${serialNumber} Already assigned to a user`);
            }
            const createdAt = new Date();
            const updatedAt = new Date();
            const userBoxId = `${userId}_${boxCheckResult.rows[0].id}`;
            const sqlFields = ['id', 'user_id', 'box_id', 'createdAt', 'updatedAt'];
            const sqlParams = [
                userBoxId,
                userId,
                boxCheckResult.rows[0].id,
                createdAt,
                updatedAt,
            ];
            const sql = `INSERT INTO User_Box (${sqlFields.join(', ')}) 
                VALUES (${sqlParams.map((_, index) => `$${index + 1}`).join(', ')}) 
                 RETURNING *`;
            const result = await connection.query(sql, sqlParams);
            return result.rows[0];
        }
        catch (error) {
            throw new Error(error.message);
        }
        finally {
            connection.release();
        }
    }
    async checkUserBox(user, boxId) {
        const connection = await database_1.default.connect();
        try {
            console.log('SSS');
            if (!user) {
                throw new Error('Please provide a userId');
            }
            const sql = 'SELECT id FROM User_Box WHERE user_id=$1 AND box_id=$2';
            const result = await connection.query(sql, [user, boxId]);
            console.log(result.rows);
            if (result.rows[0].id != undefined) {
                return true;
            }
            else {
                return false;
            }
        }
        catch (error) {
            throw new Error(error.message);
        }
        finally {
            connection.release();
        }
    }
    async assignRelativeUser(userId, boxId, email) {
        console.log('User Data655 ');
        const connection = await database_1.default.connect();
        try {
            if (await this.checkUserBox(userId, boxId)) {
                if (await user.emailExists(email)) {
                    const userData = await user.findByEmail(email);
                    console.log('User Data ' + userData);
                    const userRelative = userData != null ? userData.id : undefined;
                    const userBoxData = { user_id: userRelative, box_id: boxId };
                    const result = await this.createUserBox(userBoxData);
                    console.log('Result ' + result);
                    return result;
                }
                else {
                    throw new Error(`User with this email ${email} dosne't exist`);
                }
            }
            else {
                throw new Error(`You don't have enough permissions to do that`);
            }
        }
        catch (error) {
            throw new Error(error.message);
        }
        finally {
            connection.release();
        }
    }
}
exports.default = UserBoxModel;
//# sourceMappingURL=user.box.model.js.map