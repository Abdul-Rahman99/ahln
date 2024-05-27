import Delivery from '../types/delivery.type';
import db from '../config/database';

class DeliveryModel {
  // create delivery
  async create(d: Delivery): Promise<Delivery> {
    try {
      const connection = await db.connect();
      const {
        bar_code,
        qr_code,
        tracking_number,
        from_id,
        to_customer_id,
        delivered_date,
        delivered_status,
        transporter,
        transporter_name,
        nickname,
        description,
      } = d;

      let sql = '';
      let result;

      if (transporter === 'other') {
        sql = `INSERT INTO delivery (bar_code, qr_code, tracking_number, from_id, to_customer_id, delivered_date, delivered_status, transporter, transporter_name, nickname, description) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
               RETURNING *`;
        result = await connection.query(sql, [
          bar_code,
          qr_code,
          tracking_number,
          from_id,
          to_customer_id,
          delivered_date,
          delivered_status,
          transporter,
          transporter_name,
          nickname,
          description,
        ]);
      } else {
        sql = `INSERT INTO delivery (bar_code, qr_code, tracking_number, from_id, to_customer_id, delivered_date, delivered_status, transporter, nickname, description) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
               RETURNING *`;
        result = await connection.query(sql, [
          bar_code,
          qr_code,
          tracking_number,
          from_id,
          to_customer_id,
          delivered_date,
          delivered_status,
          transporter,
          nickname,
          description,
        ]);
      }

      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Unable to create delivery: ${(error as Error).message}`);
    }
  }

  // get all deliveries
  async getMany(): Promise<Delivery[]> {
    try {
      const connection = await db.connect();
      const sql = 'SELECT * FROM delivery';
      const result = await connection.query(sql);
      connection.release();
      return result.rows;
    } catch (error) {
      throw new Error(
        `Error retrieving deliveries: ${(error as Error).message}`,
      );
    }
  }

  // get delivery by id
  async getOne(id: number): Promise<Delivery> {
    try {
      const sql = `SELECT * FROM delivery WHERE id=$1`;
      const connection = await db.connect();
      const result = await connection.query(sql, [id]);
      connection.release();

      if (result.rows.length === 0) {
        throw new Error(`Could not find delivery with ID ${id}`);
      }
      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Could not find delivery ${id}: ${(error as Error).message}`,
      );
    }
  }

  // update delivery
  async updateOne(d: Partial<Delivery>, id: number): Promise<Delivery> {
    try {
      const connection = await db.connect();
      const queryParams: any[] = [];
      let paramIndex = 1;

      const updateFields = Object.keys(d)
        .map((key) => {
          if (d[key as keyof Delivery] !== undefined && key !== 'id') {
            queryParams.push(d[key as keyof Delivery]);
            return `${key}=$${paramIndex++}`;
          }
          return null;
        })
        .filter((field) => field !== null);

      queryParams.push(id);

      let sql = '';
      if (d.transporter === 'other') {
        sql = `UPDATE delivery SET ${updateFields.join(', ')} WHERE id=$${paramIndex} RETURNING *`;
      } else {
        // Remove transporter_name if transporter is not 'other'
        const filteredUpdateFields = updateFields.filter(
          (field): field is string =>
            !!field && !field.startsWith('transporter_name='),
        );
        sql = `UPDATE delivery SET ${filteredUpdateFields.join(', ')} WHERE id=$${paramIndex} RETURNING *`;
      }

      const result = await connection.query(sql, queryParams);
      connection.release();

      return result.rows[0];
    } catch (error) {
      throw new Error(`Could not update delivery: ${(error as Error).message}`);
    }
  }

  // delete delivery
  async deleteOne(id: number): Promise<Delivery> {
    try {
      const connection = await db.connect();
      const sql = `DELETE FROM delivery WHERE id=$1 RETURNING *`;

      const result = await connection.query(sql, [id]);
      connection.release();

      if (result.rows.length === 0) {
        throw new Error(`Could not find delivery with ID ${id}`);
      }
      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Could not delete delivery ${id}: ${(error as Error).message}`,
      );
    }
  }
}

export default DeliveryModel;
