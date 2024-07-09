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
            const sql2 = `UPDATE Delivery_Package SET is_fav = true WHERE id=$1`;
            await connection.query(sql2, [dpFavListData.delivery_package_id]);
            return result.rows[0];
        }
        catch (error) {
            throw new Error(error.message);
        }
        finally {
            connection.release();
        }
    }
    async getDPFavListById(id) {
        const connection = await database_1.default.connect();
        try {
            if (!id) {
                throw new Error('Please provide an ID');
            }
            const sql = 'SELECT * FROM DP_Fav_List WHERE delivery_package_id=$1';
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
    async deleteDPFavList(id) {
        const connection = await database_1.default.connect();
        try {
            if (!id) {
                throw new Error('ID cannot be null. Please provide a valid Delivery Package ID.');
            }
            const sql = `DELETE FROM DP_Fav_List WHERE delivery_package_id=$1 RETURNING *`;
            const result = await connection.query(sql, [id]);
            if (result.rows.length === 0) {
                throw new Error(`Could not find DP_Fav_List with ID ${id}`);
            }
            const sql2 = `UPDATE Delivery_Package SET is_fav=false WHERE id=$1`;
            await connection.query(sql2, [id]);
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
            const sql = `SELECT Delivery_Package.other_shipping_company, Box.box_label ,Box_Locker.locker_label , Delivery_Package.is_fav,
        Delivery_Package.id, Shipping_Company.title AS shipping_company_name ,tracking_number, Delivery_Package.box_id, box_locker_id, 
        shipping_company_id, shipment_status, Delivery_Package.title AS name, delivery_pin, description, Delivery_Package.createdAt 
        FROM DP_Fav_List
        INNER JOIN Delivery_Package ON Delivery_Package.id = DP_Fav_List.delivery_package_id
        LEFT JOIN Shipping_Company ON shipping_company_id = Shipping_Company.id 
        INNER JOIN Box_Locker ON Delivery_Package.box_locker_id = Box_Locker.id 
        INNER JOIN Box ON Delivery_Package.box_id = Box.id 
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