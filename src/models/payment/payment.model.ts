/* eslint-disable @typescript-eslint/no-explicit-any */
import db from '../../config/database';
import { Payment } from '../../types/payment.type';

class PaymentModel {
  // Create new Payment
  async createPayment(payment: Partial<Payment>): Promise<Payment> {
    try {
      const connection = await db.connect();
      const sql = `INSERT INTO payment (amount, card_id, billing_date, is_paid)
                   VALUES ($1, $2, $3, $4) RETURNING *`;

      const result = await connection.query(sql, [
        payment.amount,
        payment.card_id,
        payment.billing_date,
        payment.is_paid || false,
      ]);
      connection.release();
      return result.rows[0] as Payment;
    } catch (error) {
      throw new Error(`Unable to create payment: ${(error as Error).message}`);
    }
  }

  // Get all Payments
  async getAllPayments(): Promise<Payment[]> {
    try {
      const connection = await db.connect();
      const sql = `SELECT * FROM payment`;
      const result = await connection.query(sql);
      connection.release();
      return result.rows as Payment[];
    } catch (error) {
      throw new Error(`Error retrieving payments: ${(error as Error).message}`);
    }
  }

  // Get specific Payment by ID
  async getPaymentById(id: number): Promise<Payment> {
    try {
      const connection = await db.connect();
      const sql = `SELECT * FROM payment WHERE id = $1`;
      const result = await connection.query(sql, [id]);
      connection.release();
      return result.rows[0] as Payment;
    } catch (error) {
      throw new Error(
        `Could not find payment with ID ${id}: ${(error as Error).message}`,
      );
    }
  }

  // Update Payment
  async updatePayment(
    id: number,
    paymentData: Partial<Payment>,
  ): Promise<Payment> {
    try {
      const connection = await db.connect();
      const updateFields = Object.keys(paymentData)
        .map((key, index) => `${key}=$${index + 2}`)
        .join(', ');
      const sql = `UPDATE payment SET ${updateFields} WHERE id=$1 RETURNING *`;
      const result = await connection.query(sql, [
        id,
        ...Object.values(paymentData),
      ]);
      connection.release();
      return result.rows[0] as Payment;
    } catch (error) {
      throw new Error(
        `Could not update payment with ID ${id}: ${(error as Error).message}`,
      );
    }
  }

  // Delete Payment
  async deletePayment(id: number): Promise<Payment> {
    try {
      const connection = await db.connect();
      const sql = `DELETE FROM payment WHERE id=$1 RETURNING *`;
      const result = await connection.query(sql, [id]);
      connection.release();
      return result.rows[0] as Payment;
    } catch (error) {
      throw new Error(
        `Could not delete payment with ID ${id}: ${(error as Error).message}`,
      );
    }
  }

  // Get payments by user ID
  async getPaymentsByUser(userId: string): Promise<Payment[]> {
    try {
      const connection = await db.connect();
      const sql = `
        SELECT payment.id, payment.amount, payment.card_id, payment.createdAt, 
              payment.billing_date, payment.is_paid, card.card_number, card.name_on_card
        FROM payment
        INNER JOIN card ON payment.card_id = card.id
        WHERE card.user_id = $1
      `;
      const result = await connection.query(sql, [userId]);
      connection.release();
      return result.rows as Payment[];
    } catch (error) {
      throw new Error(
        `Error retrieving payments for user ${userId}: ${(error as Error).message}`,
      );
    }
  }
}

export default PaymentModel;
