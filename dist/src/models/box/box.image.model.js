"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../config/database"));
class BoxImageModel {
    async createBoxImage(boxId, deliveryPackageId, imageName) {
        const connection = await database_1.default.connect();
        try {
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
            const createdImage = result.rows[0];
            createdImage.image = `${process.env.BASE_URL}/uploads/${createdImage.image}`;
            return createdImage;
        }
        catch (error) {
            throw new Error(error.message);
        }
        finally {
            connection.release();
        }
    }
    async getAllBoxImages() {
        const connection = await database_1.default.connect();
        try {
            const sql = `SELECT id, createdAt, updatedAt, box_id, image, delivery_package_id FROM Box_IMAGE`;
            const result = await connection.query(sql);
            return result.rows;
        }
        catch (error) {
            throw new Error(error.message);
        }
        finally {
            connection.release();
        }
    }
    async getBoxImageById(id) {
        const connection = await database_1.default.connect();
        try {
            const sql = `SELECT id, createdAt, updatedAt, box_id, image, delivery_package_id FROM Box_IMAGE WHERE id = $1`;
            const result = await connection.query(sql, [id]);
            return result.rows[0] || null;
        }
        catch (error) {
            throw new Error(error.message);
        }
        finally {
            connection.release();
        }
    }
    async updateBoxImage(id, boxId, deliveryPackageId, imageName) {
        const connection = await database_1.default.connect();
        try {
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
            return result.rows[0];
        }
        catch (error) {
            throw new Error(error.message);
        }
        finally {
            connection.release();
        }
    }
    async deleteBoxImage(id) {
        const connection = await database_1.default.connect();
        try {
            const sql = `DELETE FROM Box_IMAGE WHERE id = $1`;
            await connection.query(sql, [id]);
        }
        catch (error) {
            throw new Error(error.message);
        }
        finally {
            connection.release();
        }
    }
    async getBoxImagesByBoxId(boxId) {
        const connection = await database_1.default.connect();
        try {
            const sql = `SELECT * FROM Box_IMAGE WHERE box_id = $1`;
            const result = await connection.query(sql, [boxId]);
            const boxImages = result.rows;
            return boxImages.map((image) => ({
                ...image,
                image: `${process.env.BASE_URL}/uploads/${image.image}`,
            }));
        }
        catch (error) {
            throw new Error(error.message);
        }
        finally {
            connection.release();
        }
    }
    async getBoxImagesByPackageId(packageId) {
        const connection = await database_1.default.connect();
        try {
            const sql = `SELECT * FROM Box_IMAGE WHERE delivery_package_id = $1`;
            const result = await connection.query(sql, [packageId]);
            const boxImages = result.rows;
            return boxImages.map((image) => ({
                ...image,
                image: `${process.env.BASE_URL}/uploads/${image.image}`,
            }));
        }
        catch (error) {
            throw new Error(error.message);
        }
        finally {
            connection.release();
        }
    }
}
exports.default = BoxImageModel;
//# sourceMappingURL=box.image.model.js.map