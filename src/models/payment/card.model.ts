import db from '../../config/database';
import { Card } from '../../types/card.type';

class CardModel {
  // Create new Card
  async createCard(card: Partial<Card>, userId: string): Promise<Card> {
    try {
      const connection = await db.connect();
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
      connection.release();
      return result.rows[0] as Card;
    } catch (error) {
      throw new Error(`Unable to create card: ${(error as Error).message}`);
    }
  }

  // Get all Cards
  async getAllCards(): Promise<Card[]> {
    try {
      const connection = await db.connect();
      const sql = `SELECT * FROM card`;
      const result = await connection.query(sql);
      connection.release();
      return result.rows as Card[];
    } catch (error) {
      throw new Error(`Error retrieving cards: ${(error as Error).message}`);
    }
  }

  // Get specific Card by ID
  async getCardById(id: number): Promise<Card> {
    try {
      const connection = await db.connect();

      const sql = `SELECT * FROM card WHERE id = $1`;
      const result = await connection.query(sql, [id]);
      console.log(result);

      connection.release();
      return result.rows[0] as Card;
    } catch (error) {
      throw new Error(
        `Could not find card with ID ${id}: ${(error as Error).message}`,
      );
    }
  }

  // Update Card
  async updateCard(id: number, cardData: Partial<Card>): Promise<Card> {
    try {
      const connection = await db.connect();
      const updateFields = Object.keys(cardData)
        .map((key, index) => `${key}=$${index + 2}`)
        .join(', ');
      const sql = `UPDATE card SET ${updateFields} WHERE id=$1 RETURNING *`;
      const result = await connection.query(sql, [
        id,
        ...Object.values(cardData),
      ]);
      connection.release();
      return result.rows[0] as Card;
    } catch (error) {
      throw new Error(
        `Could not update card with ID ${id}: ${(error as Error).message}`,
      );
    }
  }

  // Delete Card
  async deleteCard(id: number): Promise<Card> {
    try {
      const connection = await db.connect();
      const sql = `DELETE FROM card WHERE id=$1 RETURNING *`;
      const result = await connection.query(sql, [id]);
      connection.release();
      return result.rows[0] as Card;
    } catch (error) {
      throw new Error(
        `Could not delete card with ID ${id}: ${(error as Error).message}`,
      );
    }
  }
}

export default CardModel;