/* eslint-disable @typescript-eslint/no-explicit-any */
import db from '../../config/database';
import { Payment } from '../../types/payment.type';

class PaymentModel {
  // Create new Payment
  async createPayment(
    payment: Partial<Payment>,
    user: string,
  ): Promise<Payment> {
    const connection = await db.connect();

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
      return result.rows[0] as Payment;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Get all Payments
  async getAllPayments(): Promise<Payment[]> {
    const connection = await db.connect();

    try {
      const sql = `SELECT * FROM payment`;
      const result = await connection.query(sql);
      return result.rows as Payment[];
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Get specific Payment by ID
  async getPaymentById(id: number): Promise<Payment> {
    const connection = await db.connect();

    try {
      const sql = `SELECT * FROM payment WHERE id = $1`;
      const result = await connection.query(sql, [id]);
      return result.rows[0] as Payment;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Update Payment
  async updatePayment(
    id: number,
    paymentData: Partial<Payment>,
  ): Promise<Payment> {
    const connection = await db.connect();

    try {
      const updateFields = Object.keys(paymentData)
        .map((key, index) => `${key}=$${index + 2}`)
        .join(', ');
      const sql = `UPDATE payment SET ${updateFields} WHERE id=$1 RETURNING *`;
      const result = await connection.query(sql, [
        id,
        ...Object.values(paymentData),
      ]);
      return result.rows[0] as Payment;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Delete Payment
  async deletePayment(id: number): Promise<Payment> {
    const connection = await db.connect();

    try {
      const sql = `DELETE FROM payment WHERE id=$1 RETURNING *`;
      const result = await connection.query(sql, [id]);
      return result.rows[0] as Payment;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Get payments by user ID
  async getPaymentsByUser(userId: string): Promise<Payment[]> {
    const connection = await db.connect();

    try {
      const sql = `
        SELECT payment.id, payment.amount, payment.card_id, payment.createdAt, 
              payment.billing_date, payment.is_paid, card.card_number, card.name_on_card
        FROM payment
        INNER JOIN card ON payment.card_id = card.id
        WHERE card.user_id = $1
      `;
      const result = await connection.query(sql, [userId]);
      return result.rows as Payment[];
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }
}

export default PaymentModel;
