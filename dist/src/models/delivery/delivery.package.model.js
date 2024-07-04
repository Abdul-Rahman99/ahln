"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../config/database"));
const database_2 = __importDefault(require("../../config/database"));
class DeliveryPackageModel {
    async generateCustomId(userId) {
        try {
            const regexMatch = userId.match(/Ahln_(\d+)_U(\d+)/);
            if (!regexMatch || regexMatch.length < 3) {
                throw new Error('Invalid userId format');
            }
            const numericPart = regexMatch[2];
            const result = await database_1.default.query('SELECT MAX(CAST(SUBSTRING(id FROM 17) AS INTEGER)) AS max_id FROM Delivery_Package WHERE id LIKE $1', [`Ahln_${numericPart}_U%`]);
            let nextId = 1;
            if (result.rows.length > 0 && result.rows[0].max_id !== null) {
                nextId = result.rows[0].max_id + 1;
            }
            const nextIdFormatted = nextId.toString().padStart(7, '0');
            return `Ahln_${numericPart}_U${nextIdFormatted}`;
        }
        catch (error) {
            console.error('Error generating custom ID:', error.message);
            throw error;
        }
    }
    async createDeliveryPackage(userId, deliveryPackage) {
        const connection = await database_2.default.connect();
        try {
            const createdAt = new Date();
            const updatedAt = new Date();
            const customId = await this.generateCustomId(userId);
            const sqlBox = `SELECT address_id FROM Box WHERE id=$1`;
            const address_id = (await connection.query(sqlBox, [deliveryPackage.box_id])).rows[0].address_id;
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
                'box_locker_string',
                'title',
                'delivery_pin',
                'description',
            ];
            const sqlParams = [
                customId,
                createdAt,
                updatedAt,
                userId,
                deliveryPackage.vendor_id || null,
                deliveryPackage.delivery_id || null,
                deliveryPackage.tracking_number || null,
                address_id,
                deliveryPackage.shipping_company_id || null,
                deliveryPackage.box_id || null,
                deliveryPackage.box_locker_id || null,
                deliveryPackage.shipment_status || 'pending',
                deliveryPackage.is_delivered || false,
                deliveryPackage.box_locker_string || null,
                deliveryPackage.title || null,
                deliveryPackage.delivery_pin || null,
                deliveryPackage.description || null,
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
            const connection = await database_2.default.connect();
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
            const connection = await database_2.default.connect();
            const sql = 'SELECT * FROM Delivery_Package WHERE id=$1';
            const result = await connection.query(sql, [id]);
            connection.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Could not find delivery package ${id}: ${error.message}`);
        }
    }
    async updateOne(deliveryPackage, id) {
        try {
            const connection = await database_2.default.connect();
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
            const connection = await database_2.default.connect();
            if (!id) {
                throw new Error('ID cannot be null. Please provide a valid Delivery Package ID.');
            }
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
    async getPackagesByUser(userId, status) {
        try {
            const connection = await database_2.default.connect();
            const sql = 'SELECT * FROM Delivery_Package WHERE customer_id = $1  AND shipment_status = $2';
            const params = [userId, status];
            const result = await connection.query(sql, params);
            connection.release();
            return result.rows;
        }
        catch (error) {
            throw new Error(`Error retrieving delivery packages for user ${userId}: ${error.message}`);
        }
    }
}
exports.default = DeliveryPackageModel;
//# sourceMappingURL=delivery.package.model.js.map