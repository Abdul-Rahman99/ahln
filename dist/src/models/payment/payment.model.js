"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../config/database"));
class PaymentModel {
    async createPayment(payment, user) {
        const connection = await database_1.default.connect();
        try {
            const sql = `INSERT INTO payment (amount, card_id, billing_date, is_paid, customer_id)
                   VALUES ($1, $2, $3, $4, $5) RETURNING *`;
            const result = await connection.query(sql, [
                payment.amount,
                payment.card_id,
                payment.billing_date,
                payment.is_paid || false,
                user,
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
    async getAllPayments() {
        const connection = await database_1.default.connect();
        try {
            const sql = `SELECT * FROM payment`;
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
    async getPaymentById(id) {
        const connection = await database_1.default.connect();
        try {
            const sql = `SELECT * FROM payment WHERE id = $1`;
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
    async updatePayment(id, paymentData) {
        const connection = await database_1.default.connect();
        try {
            const updateFields = Object.keys(paymentData)
                .map((key, index) => `${key}=$${index + 2}`)
                .join(', ');
            const sql = `UPDATE payment SET ${updateFields} WHERE id=$1 RETURNING *`;
            const result = await connection.query(sql, [
                id,
                ...Object.values(paymentData),
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
    async deletePayment(id) {
        const connection = await database_1.default.connect();
        try {
            const sql = `DELETE FROM payment WHERE id=$1 RETURNING *`;
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
    async getPaymentsByUser(userId) {
        const connection = await database_1.default.connect();
        try {
            const sql = `
        SELECT payment.id, payment.amount, payment.card_id, payment.createdAt, 
              payment.billing_date, payment.is_paid, card.card_number, card.name_on_card
        FROM payment
        INNER JOIN card ON payment.card_id = card.id
        WHERE card.user_id = $1
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
    async getUserByPayment(id) {
        const connection = await database_1.default.connect();
        try {
            const sql = `SELECT customer_id FROM payment WHERE id=$1`;
            const result = await connection.query(sql, [id]);
            return result.rows[0].customer_id;
        }
        catch (error) {
            throw new Error(error.message);
        }
        finally {
            connection.release();
        }
    }
}
exports.default = PaymentModel;
//# sourceMappingURL=payment.model.js.map