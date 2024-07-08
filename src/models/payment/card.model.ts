import db from '../../config/database';
import { Card } from '../../types/card.type';

class CardModel {
  // Create new Card
  async createCard(card: Partial<Card>, userId: string): Promise<Card> {
    const connection = await db.connect();

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
      return result.rows[0] as Card;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Get all Cards
  async getAllCards(): Promise<Card[]> {
    const connection = await db.connect();

    try {
      const sql = `SELECT * FROM card`;
      const result = await connection.query(sql);
      return result.rows as Card[];
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Get specific Card by ID
  async getCardById(id: number): Promise<Card> {
    const connection = await db.connect();

    try {
      const sql = `SELECT * FROM card WHERE id = $1`;
      const result = await connection.query(sql, [id]);

      return result.rows[0] as Card;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Update Card
  async updateCard(id: number, cardData: Partial<Card>): Promise<Card> {
    const connection = await db.connect();

    try {
      const updateFields = Object.keys(cardData)
        .map((key, index) => `${key}=$${index + 2}`)
        .join(', ');
      const sql = `UPDATE card SET ${updateFields} WHERE id=$1 RETURNING *`;
      const result = await connection.query(sql, [
        id,
        ...Object.values(cardData),
      ]);
      return result.rows[0] as Card;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Delete Card
  async deleteCard(id: number): Promise<Card> {
    const connection = await db.connect();

    try {
      const sql = `DELETE FROM card WHERE id=$1 RETURNING *`;
      const result = await connection.query(sql, [id]);
      return result.rows[0] as Card;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }
}

export default CardModel;
