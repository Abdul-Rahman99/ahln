"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../config/database"));
class BoxImageModel {
    async createBoxImage(boxId, deliveryPackageId, imageName) {
        try {
            const connection = await database_1.default.connect();
            const createdAt = new Date();
            const updatedAt = new Date();
            const sqlFields = [
                'box_id',
                'createdAt',
                'updatedAt',
                'image',
                'delivery_package_id',
            ];
            const sqlParams = [
                boxId,
                createdAt,
                updatedAt,
                imageName,
                deliveryPackageId,
            ];
            const sql = `INSERT INTO Box_IMAGE (${sqlFields.join(', ')}) 
                   VALUES (${sqlParams.map((_, index) => `$${index + 1}`).join(', ')}) 
                   RETURNING *`;
            const result = await connection.query(sql, sqlParams);
            connection.release();
            const createdImage = result.rows[0];
            createdImage.image = `${process.env.BASE_URL}/uploads/${createdImage.image}`;
            return createdImage;
        }
        catch (error) {
            throw new Error(`Unable to create box image: ${error.message}`);
        }
    }
    async getAllBoxImages() {
        try {
            const connection = await database_1.default.connect();
            const sql = `SELECT id, createdAt, updatedAt, box_id, image, delivery_package_id FROM Box_IMAGE`;
            const result = await connection.query(sql);
            connection.release();
            return result.rows;
        }
        catch (error) {
            throw new Error(`Unable to fetch box images: ${error.message}`);
        }
    }
    async getBoxImageById(id) {
        try {
            const connection = await database_1.default.connect();
            const sql = `SELECT id, createdAt, updatedAt, box_id, image, delivery_package_id FROM Box_IMAGE WHERE id = $1`;
            const result = await connection.query(sql, [id]);
            connection.release();
            return result.rows[0] || null;
        }
        catch (error) {
            throw new Error(`Unable to fetch box image with ID ${id}: ${error.message}`);
        }
    }
    async updateBoxImage(id, boxId, deliveryPackageId, imageName) {
        try {
            const connection = await database_1.default.connect();
            const updatedAt = new Date();
            const sql = `
        UPDATE Box_IMAGE 
        SET box_id = $1, delivery_package_id = $2, image = $3, updatedAt = $4
        WHERE id = $5
        RETURNING id, createdAt, updatedAt, box_id, image, delivery_package_id
      `;
            const result = await connection.query(sql, [
                boxId,
                deliveryPackageId,
                imageName,
                updatedAt,
                id,
            ]);
            connection.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Unable to update box image with ID ${id}: ${error.message}`);
        }
    }
    async deleteBoxImage(id) {
        try {
            const connection = await database_1.default.connect();
            const sql = `DELETE FROM Box_IMAGE WHERE id = $1`;
            await connection.query(sql, [id]);
            connection.release();
        }
        catch (error) {
            throw new Error(`Unable to delete box image with ID ${id}: ${error.message}`);
        }
    }
    async getBoxImagesByUser(userId) {
        try {
            const connection = await database_1.default.connect();
            const sql = `
        SELECT bi.*
        FROM Box_IMAGE bi
        INNER JOIN Delivery_Package dp ON bi.delivery_package_id = dp.id
        WHERE dp.customer_id = $1
      `;
            const result = await connection.query(sql, [userId]);
            connection.release();
            const boxImages = result.rows;
            return boxImages.map((image) => ({
                ...image,
                image: `${process.env.BASE_URL}/uploads/${image.image}`,
            }));
        }
        catch (error) {
            throw new Error(`Unable to fetch box images for user ID ${userId}: ${error.message}`);
        }
    }
    async getBoxImagesByBoxId(boxId) {
        try {
            const connection = await database_1.default.connect();
            const sql = `SELECT * FROM Box_IMAGE WHERE box_id = $1`;
            const result = await connection.query(sql, [boxId]);
            connection.release();
            const boxImages = result.rows;
            return boxImages.map((image) => ({
                ...image,
                image: `${process.env.BASE_URL}/uploads/${image.image}`,
            }));
        }
        catch (error) {
            throw new Error(`Unable to fetch box images for box ID ${boxId}: ${error.message}`);
        }
    }
    async getBoxImagesByPackageId(packageId) {
        try {
            const connection = await database_1.default.connect();
            const sql = `SELECT * FROM Box_IMAGE WHERE delivery_package_id = $1`;
            const result = await connection.query(sql, [packageId]);
            connection.release();
            const boxImages = result.rows;
            return boxImages.map((image) => ({
                ...image,
                image: `${process.env.BASE_URL}/uploads/${image.image}`,
            }));
        }
        catch (error) {
            throw new Error(`Unable to fetch box images for package ID ${packageId}: ${error.message}`);
        }
    }
}
exports.default = BoxImageModel;
//# sourceMappingURL=box.image.model.js.map