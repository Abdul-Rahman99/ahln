"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../config/database"));
const database_2 = __importDefault(require("../../config/database"));
const box_locker_model_1 = __importDefault(require("../../models/box/box.locker.model"));
class BoxModel {
    boxLockerModel = new box_locker_model_1.default();
    async createBox(box) {
        const connection = await database_1.default.connect();
        try {
            const createdAt = new Date();
            const updatedAt = new Date();
            async function generateBoxId() {
                try {
                    const currentYear = new Date().getFullYear().toString().slice(-2);
                    let nextId = 1;
                    const result = await database_2.default.query('SELECT MAX(CAST(SUBSTRING(id FROM 11 FOR 7) AS INTEGER)) AS max_id FROM Box');
                    if (result.rows.length > 0) {
                        nextId = (result.rows[0].max_id || 0) + 1;
                    }
                    const nextIdFormatted = nextId.toString().padStart(7, '0');
                    const id = `Ahln_${currentYear}_B${nextIdFormatted}`;
                    return id;
                }
                catch (error) {
                    console.error('Error generating box_id:', error.message);
                    throw error;
                }
            }
            const id = await generateBoxId();
            const generationResult = await connection.query('SELECT * FROM Box_Generation WHERE id=$1', [box.box_model_id]);
            if (generationResult.rows.length === 0) {
                throw new Error(`Box generation with ID ${box.box_model_id} does not exist`);
            }
            const boxGeneration = generationResult.rows[0];
            const numberOfDoors = boxGeneration.number_of_doors;
            const sqlFields = [
                'id',
                'serial_number',
                'box_label',
                'createdAt',
                'updatedAt',
                'has_empty_lockers',
                'current_tablet_id',
                'previous_tablet_id',
                'box_model_id',
                'address_id',
            ];
            const sqlParams = [
                id,
                box.serial_number,
                box.box_label,
                createdAt,
                updatedAt,
                box.has_empty_lockers,
                box.current_tablet_id,
                box.previous_tablet_id,
                box.box_model_id,
                box.address_id,
            ];
            const sql = `INSERT INTO Box (${sqlFields.join(', ')}) 
                  VALUES (${sqlParams.map((_, index) => `$${index + 1}`).join(', ')}) 
                   RETURNING *`;
            const result = await connection.query(sql, sqlParams);
            const serial_ports = [
                "{door: 'door1', hex: 'fb01010032fefeffcdbf', statu: 'door1 is unlocked'}",
                "{door: 'door2', hex: 'fb01020032fefdffcdbf', statu: 'door2 is unlocked'}",
                "{door: 'door3', hex: 'fb01030032fefcffcdbf', statu: 'door3 is unlocked'}",
            ];
            for (let i = 1; i <= numberOfDoors; i++) {
                const lockerId = `${id}_${i}`;
                const lockerLabel = `Locker ${i}`;
                await this.boxLockerModel.createBoxLocker({
                    id: lockerId,
                    locker_label: lockerLabel,
                    serial_port: serial_ports[i - 1],
                    createdAt,
                    updatedAt,
                    is_empty: true,
                    box_id: id,
                });
            }
            connection.release();
            return result.rows[0];
        }
        catch (error) {
            connection.release();
            throw new Error(`Unable to create box: ${error.message}`);
        }
    }
    async getMany() {
        try {
            const connection = await database_1.default.connect();
            const sql = 'SELECT * FROM Box';
            const result = await connection.query(sql);
            connection.release();
            return result.rows;
        }
        catch (error) {
            throw new Error(`Error retrieving boxes: ${error.message}`);
        }
    }
    async getOne(id) {
        try {
            if (!id) {
                throw new Error('ID cannot be null. Please provide a valid box ID.');
            }
            const sql = 'SELECT * FROM Box WHERE id=$1';
            const connection = await database_1.default.connect();
            const result = await connection.query(sql, [id]);
            connection.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Could not find box ${id}: ${error.message}`);
        }
    }
    async updateOne(box, id) {
        try {
            const connection = await database_1.default.connect();
            const checkSql = 'SELECT * FROM Box WHERE id=$1';
            await connection.query(checkSql, [id]);
            const queryParams = [];
            let paramIndex = 1;
            const updatedAt = new Date();
            const updateFields = Object.keys(box)
                .map((key) => {
                if (box[key] !== undefined &&
                    key !== 'id' &&
                    key !== 'createdAt') {
                    queryParams.push(box[key]);
                    return `${key}=$${paramIndex++}`;
                }
                return null;
            })
                .filter((field) => field !== null);
            queryParams.push(updatedAt);
            updateFields.push(`updatedAt=$${paramIndex++}`);
            queryParams.push(id);
            const sql = `UPDATE Box SET ${updateFields.join(', ')} WHERE id=$${paramIndex} RETURNING *`;
            const result = await connection.query(sql, queryParams);
            connection.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Could not update box ${id}: ${error.message}`);
        }
    }
    async deleteOne(id) {
        try {
            const connection = await database_1.default.connect();
            if (!id) {
                throw new Error('ID cannot be null. Please provide a valid box ID.');
            }
            const sql = `DELETE FROM Box WHERE id=$1 RETURNING *`;
            const result = await connection.query(sql, [id]);
            if (result.rows.length === 0) {
                throw new Error(`Could not find box with ID ${id}`);
            }
            connection.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Could not delete box ${id}: ${error.message}`);
        }
    }
    async getBoxesByGenerationId(boxGenerationId) {
        try {
            const connection = await database_1.default.connect();
            const checkSql = 'SELECT * FROM Box_Generation WHERE id=$1';
            await connection.query(checkSql, [boxGenerationId]);
            const sql = `
        SELECT * FROM Box
        WHERE box_model_id = $1
      `;
            const result = await connection.query(sql, [boxGenerationId]);
            connection.release();
            return result.rows;
        }
        catch (error) {
            throw new Error(`Error fetching boxes by box generation ID: ${error.message}`);
        }
    }
    async getBoxByTabletInfo(androidTabletId, tabletSerialNumber) {
        try {
            const connection = await database_1.default.connect();
            const sql = `
        SELECT id , b.current_tablet_id , b.id 
        FROM tablet
        INNER JOIN Box as b ON b.current_tablet_id= id
        WHERE serial_number = $1
      `;
            const result = await connection.query(sql, [tabletSerialNumber]);
            const updateSql = `
      UPDATE tablet SET android_id = ${androidTabletId} WHERE id=${result.rows[0].id}`;
            await connection.query(updateSql);
            connection.release();
            if (result.rows.length === 0) {
                return null;
            }
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Error retrieving box by tablet info: ${error.message}`);
        }
    }
}
exports.default = BoxModel;
//# sourceMappingURL=box.model.js.map