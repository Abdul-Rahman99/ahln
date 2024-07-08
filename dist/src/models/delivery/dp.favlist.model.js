"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../config/database"));
class DPFavListModel {
    async createDPFavList(dpFavListData, user) {
        const connection = await database_1.default.connect();
        try {
            const createdAt = new Date();
            const updatedAt = new Date();
            const sqlFields = [
                'createdAt',
                'updatedAt',
                'delivery_package_id',
                'user_id',
            ];
            const sqlParams = [
                createdAt,
                updatedAt,
                dpFavListData.delivery_package_id,
                user,
            ];
            const sql = `INSERT INTO DP_Fav_List (${sqlFields.join(', ')}) 
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
    async deleteDPFavList(id) {
        const connection = await database_1.default.connect();
        try {
            if (!id) {
                throw new Error('ID cannot be null. Please provide a valid DP_Fav_List ID.');
            }
            const sql = `DELETE FROM DP_Fav_List WHERE id=$1 RETURNING *`;
            const result = await connection.query(sql, [id]);
            if (result.rows.length === 0) {
                throw new Error(`Could not find DP_Fav_List with ID ${id}`);
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
    async getDPFavListsByUser(userId) {
        const connection = await database_1.default.connect();
        try {
            if (!userId) {
                throw new Error('ID cannot be null. Please provide a valid User ID.');
            }
            const sql = `SELECT DP_Fav_List.* FROM DP_Fav_List
                  WHERE DP_Fav_List.user_id = $1`;
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
}
exports.default = DPFavListModel;
//# sourceMappingURL=dp.favlist.model.js.map