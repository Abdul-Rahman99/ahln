"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../config/database"));
class CardModel {
    async createCard(card, userId) {
        const connection = await database_1.default.connect();
        try {
            const sql = `INSERT INTO card (card_number, expire_date, cvv, name_on_card, billing_address, user_id)
                   VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
            const result = await connection.query(sql, [
                card.card_number,
                card.expire_date,
                card.cvv,
                card.name_on_card,
                card.billing_address,
                userId,
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
    async getAllCards() {
        const connection = await database_1.default.connect();
        try {
            const sql = `SELECT * FROM card`;
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
    async getCardById(id) {
        const connection = await database_1.default.connect();
        try {
            const sql = `SELECT * FROM card WHERE id = $1`;
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
    async updateCard(id, cardData) {
        const connection = await database_1.default.connect();
        try {
            const updateFields = Object.keys(cardData)
                .map((key, index) => `${key}=$${index + 2}`)
                .join(', ');
            const sql = `UPDATE card SET ${updateFields} WHERE id=$1 RETURNING *`;
            const result = await connection.query(sql, [
                id,
                ...Object.values(cardData),
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
    async deleteCard(id) {
        const connection = await database_1.default.connect();
        try {
            const sql = `DELETE FROM card WHERE id=$1 RETURNING *`;
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
}
exports.default = CardModel;
//# sourceMappingURL=card.model.js.map