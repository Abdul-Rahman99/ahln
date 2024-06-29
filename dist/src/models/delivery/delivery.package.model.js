"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../config/database"));
class DeliveryPackageModel {
    async generateCustomId(userId) {
        try {
            const result = await database_1.default.query('SELECT MAX(CAST(SUBSTRING(id FROM 11 FOR 7) AS INTEGER)) AS max_id FROM Delivery_Package WHERE id LIKE $1', [`${userId}%`]);
            let nextId = 1;
            if (result.rows.length > 0 && result.rows[0].max_id) {
                nextId = result.rows[0].max_id + 1;
            }
            const nextIdFormatted = nextId.toString().padStart(7, '0');
            return `${userId}_${nextIdFormatted}`;
        }
        catch (error) {
            console.error('Error generating custom ID:', error.message);
            throw error;
        }
    }
    async createDeliveryPackage(deliveryPackage) {
        const connection = await database_1.default.connect();
        try {
            const createdAt = new Date();
            const updatedAt = new Date();
            const customId = await this.generateCustomId(deliveryPackage.customer_id);
            const sqlFields = [
                'id',
                'createdAt',
                'updatedAt',
                'customer_id',
                'vendor_id',
                'delivery_id',
                'tracking_number',
                'address_id',
                'shipping_company_id',
                'box_id',
                'box_locker_id',
                'shipment_status',
                'is_delivered',
            ];
            const sqlParams = [
                customId,
                createdAt,
                updatedAt,
                deliveryPackage.customer_id,
                deliveryPackage.vendor_id,
                deliveryPackage.delivery_id,
                deliveryPackage.tracking_number,
                deliveryPackage.address_id,
                deliveryPackage.shipping_company_id,
                deliveryPackage.box_id,
                deliveryPackage.box_locker_id,
                deliveryPackage.shipment_status,
                deliveryPackage.is_delivered,
            ];
            const sql = `INSERT INTO Delivery_Package (${sqlFields.join(', ')}) 
                   VALUES (${sqlParams.map((_, index) => `$${index + 1}`).join(', ')}) 
                   RETURNING *`;
            const result = await connection.query(sql, sqlParams);
            connection.release();
            return result.rows[0];
        }
        catch (error) {
            connection.release();
            throw new Error(`Unable to create delivery package: ${error.message}`);
        }
    }
    async getMany() {
        try {
            const connection = await database_1.default.connect();
            const sql = 'SELECT * FROM Delivery_Package';
            const result = await connection.query(sql);
            connection.release();
            return result.rows;
        }
        catch (error) {
            throw new Error(`Error retrieving delivery packages: ${error.message}`);
        }
    }
    async getOne(id) {
        try {
            const connection = await database_1.default.connect();
            const sql = 'SELECT * FROM Delivery_Package WHERE id=$1';
            const result = await connection.query(sql, [id]);
            connection.release();
            if (result.rows.length === 0) {
                throw new Error(`Could not find delivery package with ID ${id}`);
            }
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Could not find delivery package ${id}: ${error.message}`);
        }
    }
    async updateOne(deliveryPackage, id) {
        try {
            const connection = await database_1.default.connect();
            const checkSql = 'SELECT * FROM Delivery_Package WHERE id=$1';
            const checkResult = await connection.query(checkSql, [id]);
            if (checkResult.rows.length === 0) {
                throw new Error(`Delivery package with ID ${id} does not exist`);
            }
            const queryParams = [];
            let paramIndex = 1;
            const updatedAt = new Date();
            const updateFields = Object.keys(deliveryPackage)
                .map((key) => {
                if (deliveryPackage[key] !== undefined &&
                    key !== 'id' &&
                    key !== 'createdAt') {
                    queryParams.push(deliveryPackage[key]);
                    return `${key}=$${paramIndex++}`;
                }
                return null;
            })
                .filter((field) => field !== null);
            queryParams.push(updatedAt);
            updateFields.push(`updatedAt=$${paramIndex++}`);
            queryParams.push(id);
            const sql = `UPDATE Delivery_Package SET ${updateFields.join(', ')} WHERE id=$${paramIndex} RETURNING *`;
            const result = await connection.query(sql, queryParams);
            connection.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Could not update delivery package ${id}: ${error.message}`);
        }
    }
    async deleteOne(id) {
        try {
            const connection = await database_1.default.connect();
<<<<<<< HEAD
            if (!id) {
                throw new Error('ID cannot be null. Please provide a valid Delivery Package ID.');
            }
=======
>>>>>>> ce58a39bd331e5af6e237f641e42a06c0bd628f6
            const sql = `DELETE FROM Delivery_Package WHERE id=$1 RETURNING *`;
            const result = await connection.query(sql, [id]);
            connection.release();
            if (result.rows.length === 0) {
                throw new Error(`Could not find delivery package with ID ${id}`);
            }
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Could not delete delivery package ${id}: ${error.message}`);
        }
    }
}
exports.default = DeliveryPackageModel;
//# sourceMappingURL=delivery.package.model.js.map