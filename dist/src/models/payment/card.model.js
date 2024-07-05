"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../config/database"));
class CardModel {
    async createCard(card) {
        try {
            const connection = await database_1.default.connect();
            const sql = `INSERT INTO card (card_number, expire_date, cvv, name_on_card, billing_address, user_id)
                   VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
            const result = await connection.query(sql, [
                card.card_number,
                card.expire_date,
                card.cvv,
                card.name_on_card,
                card.billing_address,
                card.user_id,
            ]);
            connection.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Unable to create card: ${error.message}`);
        }
    }
    async getAllCards() {
        try {
            const connection = await database_1.default.connect();
            const sql = `SELECT * FROM card`;
            const result = await connection.query(sql);
            connection.release();
            return result.rows;
        }
        catch (error) {
            throw new Error(`Error retrieving cards: ${error.message}`);
        }
    }
    async getCardById(id) {
        try {
            const connection = await database_1.default.connect();
            const sql = `SELECT * FROM card WHERE id = $1`;
            const result = await connection.query(sql, [id]);
            console.log(result);
            connection.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Could not find card with ID ${id}: ${error.message}`);
        }
    }
    async updateCard(id, cardData) {
        try {
            const connection = await database_1.default.connect();
            const updateFields = Object.keys(cardData)
                .map((key, index) => `${key}=$${index + 2}`)
                .join(', ');
            const sql = `UPDATE card SET ${updateFields} WHERE id=$1 RETURNING *`;
            const result = await connection.query(sql, [
                id,
                ...Object.values(cardData),
            ]);
            connection.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Could not update card with ID ${id}: ${error.message}`);
        }
    }
    async deleteCard(id) {
        try {
            const connection = await database_1.default.connect();
            const sql = `DELETE FROM card WHERE id=$1 RETURNING *`;
            const result = await connection.query(sql, [id]);
            connection.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Could not delete card with ID ${id}: ${error.message}`);
        }
    }
}
exports.default = CardModel;
//# sourceMappingURL=card.model.js.map