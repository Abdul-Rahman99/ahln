"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../config/database"));
class PaymentModel {
    async createPayment(payment) {
        try {
            const connection = await database_1.default.connect();
            const sql = `INSERT INTO payment (amount, card_id, billing_date, is_paid)
                   VALUES ($1, $2, $3, $4) RETURNING *`;
            const result = await connection.query(sql, [
                payment.amount,
                payment.card_id,
                payment.billing_date,
                payment.is_paid || false,
            ]);
            connection.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Unable to create payment: ${error.message}`);
        }
    }
    async getAllPayments() {
        try {
            const connection = await database_1.default.connect();
            const sql = `SELECT * FROM payment`;
            const result = await connection.query(sql);
            connection.release();
            return result.rows;
        }
        catch (error) {
            throw new Error(`Error retrieving payments: ${error.message}`);
        }
    }
    async getPaymentById(id) {
        try {
            const connection = await database_1.default.connect();
            const sql = `SELECT * FROM payment WHERE id = $1`;
            const result = await connection.query(sql, [id]);
            connection.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Could not find payment with ID ${id}: ${error.message}`);
        }
    }
    async updatePayment(id, paymentData) {
        try {
            const connection = await database_1.default.connect();
            const updateFields = Object.keys(paymentData)
                .map((key, index) => `${key}=$${index + 2}`)
                .join(', ');
            const sql = `UPDATE payment SET ${updateFields} WHERE id=$1 RETURNING *`;
            const result = await connection.query(sql, [
                id,
                ...Object.values(paymentData),
            ]);
            connection.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Could not update payment with ID ${id}: ${error.message}`);
        }
    }
    async deletePayment(id) {
        try {
            const connection = await database_1.default.connect();
            const sql = `DELETE FROM payment WHERE id=$1 RETURNING *`;
            const result = await connection.query(sql, [id]);
            connection.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Could not delete payment with ID ${id}: ${error.message}`);
        }
    }
    async getPaymentsByUser(userId) {
        try {
            const connection = await database_1.default.connect();
            const sql = `
        SELECT payment.id, payment.amount, payment.card_id, payment.createdAt, 
              payment.billing_date, payment.is_paid, card.card_number, card.name_on_card
        FROM payment
        INNER JOIN card ON payment.card_id = card.id
        WHERE card.user_id = $1
      `;
            const result = await connection.query(sql, [userId]);
            connection.release();
            return result.rows;
        }
        catch (error) {
            throw new Error(`Error retrieving payments for user ${userId}: ${error.message}`);
        }
    }
}
exports.default = PaymentModel;
//# sourceMappingURL=payment.model.js.map