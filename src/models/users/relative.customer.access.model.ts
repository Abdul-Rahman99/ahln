import { RelativeCustomerAccess } from '../../types/realative.customer.acces.type';
import db from '../../config/database';

class RelativeCustomerAccessModel {
  // create PIN
  async createRelativeCustomerAccess(
    RelativeCustomerAccess: Partial<RelativeCustomerAccess>,
  ): Promise<RelativeCustomerAccess> {
    const connection = await db.connect();
    try {
      const createdAt = new Date();
      const updatedAt = new Date();

      const sqlFields = [
        'createdAt',
        'updatedAt',
        'relative_customer_id',
        'box_id',
        'add_shipment',
        'read_owner_shipment',
        'read_own_shipment',
        'create_pin',
        'create_offline_otps',
        'create_otp',
        'open_door1',
        'open_door2',
        'open_door3',
        'read_playback',
        'read_notification',
        'craete_realative_customer',
        'transfer_box_ownership',
        'read_history',
        'update_box_screen_message',
        'read_live_stream',
        'update_box_data',
      ];

      const sqlParams = [
        createdAt,
        updatedAt,
        RelativeCustomerAccess.relative_customer_id,
        RelativeCustomerAccess.box_id,
        RelativeCustomerAccess.add_shipment || false,
        RelativeCustomerAccess.read_owner_shipment || false,
        RelativeCustomerAccess.read_own_shipment || false,
        RelativeCustomerAccess.create_pin || false,
        RelativeCustomerAccess.create_offline_otps || false,
        RelativeCustomerAccess.create_otp || false,
        RelativeCustomerAccess.open_door1 || false,
        RelativeCustomerAccess.open_door2 || false,
        RelativeCustomerAccess.open_door3 || false,
        RelativeCustomerAccess.read_playback || false,
        RelativeCustomerAccess.read_notification || false,
        RelativeCustomerAccess.craete_realative_customer || false,
        RelativeCustomerAccess.transfer_box_ownership || false,
        RelativeCustomerAccess.read_history || false,
        RelativeCustomerAccess.update_box_screen_message || false,
        RelativeCustomerAccess.read_live_stream || false,
        RelativeCustomerAccess.update_box_data || false,
      ];

      const sql = `INSERT INTO relative_customer_access (${sqlFields.join(', ')}) 
                VALUES (${sqlParams.map((_, index) => `$${index + 1}`).join(', ')}) 
                RETURNING *`;

      const result = await connection.query(sql, sqlParams);
      return result.rows[0];
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // update relative customer access
  async updateOne(
    b: Partial<RelativeCustomerAccess>,
    id: number,
  ): Promise<RelativeCustomerAccess> {
    const connection = await db.connect();
    try {
      const checkSql = 'SELECT * FROM relative_customer_access WHERE id=$1';
      const checkResult = await connection.query(checkSql, [id]);

      if (checkResult.rows.length === 0) {
        throw new Error(
          `Relative Customer Access with ID ${id} does not exist`,
        );
      }

      const queryParams: unknown[] = [];
      let paramIndex = 1;

      const updatedAt = new Date();

      const updateFields = Object.keys(b)
        .map((key) => {
          if (
            b[key as keyof RelativeCustomerAccess] !== undefined &&
            key !== 'id' &&
            key !== 'createdAt'
          ) {
            queryParams.push(b[key as keyof RelativeCustomerAccess]);
            return `${key}=$${paramIndex++}`;
          }
          return null;
        })
        .filter((field) => field !== null);

      queryParams.push(updatedAt); // Add the updatedAt timestamp
      updateFields.push(`updatedAt=$${paramIndex++}`); // Include updatedAt field in the update query

      queryParams.push(id); // Add the box generation ID to the query parameters

      const sql = `UPDATE relative_customer_access SET ${updateFields.join(', ')} WHERE id=$${paramIndex} RETURNING *`;

      const result = await connection.query(sql, queryParams);
      return result.rows[0] as RelativeCustomerAccess;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // get all relative customer access
  async getAllRelativeCustomerAccess(
    user: string,
    boxId: string,
  ): Promise<RelativeCustomerAccess[]> {
    const connection = await db.connect();
    try {
      const sql =
        'SELECT * FROM relative_customer_access WHERE relative_customer_id = $1 AND box_id = $2 ORDER BY createdat DESC';
      const result = await connection.query(sql, [user, boxId]);

      return result.rows[0] as RelativeCustomerAccess[];
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  async getRelativeCustomerAccess(
    id: string,
  ): Promise<RelativeCustomerAccess[]> {
    const connection = await db.connect();
    try {
      const sql =
        'SELECT id FROM relative_customer_access WHERE relative_customer_id = $1';
      const result = await connection.query(sql, [id]);
      if (result.rows.length === 0) {
        throw new Error(
          `Relative Customer Access with ID ${id} does not exist`,
        );
      }
      return result.rows[0].id as RelativeCustomerAccess[];
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }
}

export default RelativeCustomerAccessModel;
