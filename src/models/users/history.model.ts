/* eslint-disable @typescript-eslint/no-explicit-any */
import db from '../../config/database';

class HistoryModel {
  // List all Tables in the database
  async getAllTables(): Promise<Array<any>> {
    const connection = await db.connect();
    try {
      const sql = `select table_schema||'.'||table_name as table_fullname
        from information_schema."tables"
        where table_type = 'BASE TABLE'
        and table_schema not in ('pg_catalog', 'information_schema');`;
      const result = await connection.query(sql);
      return result.rows
        .filter(
          (table) =>
            !table.table_fullname.includes('users') &&
            !table.table_fullname.includes('role') &&
            !table.table_fullname.includes('migrations') &&
            !table.table_fullname.includes('shipping_company') &&
            !table.table_fullname.includes('tablet') &&
            !table.table_fullname.includes('box_generation') &&
            !table.table_fullname.includes('address') &&
            !table.table_fullname.includes('box_locker') &&
            !table.table_fullname.includes('otp') &&
            !table.table_fullname.includes('user_devices') &&
            !table.table_fullname.includes('mobile_pages') &&
            !table.table_fullname.includes('audit_trail') &&
            !table.table_fullname.includes('system_log') &&
            !table.table_fullname.includes('payment') &&
            !table.table_fullname.includes('card') &&
            !table.table_fullname.includes('box_screen_messages') &&
            !table.table_fullname.includes('contact_us') &&
            !table.table_fullname.includes('delivery_package') &&
            !table.table_fullname.includes('sales_invoice') &&
            !table.table_fullname.includes('mqtt_topic') &&
            !table.table_fullname.includes('mqtt_log') &&
            !table.table_fullname.includes('user_guide') &&
            !table.table_fullname.includes('about_us') &&
            !table.table_fullname.includes('user_permission') &&
            !table.table_fullname.includes('permission'),
        )
        .map((table) => table.table_fullname.replace('public.', ''));
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // get all table history data with dates
  async getTableHistory(table: string, userId: string): Promise<Array<string>> {
    const connection = await db.connect();
    const tables = await this.getAllTables();
    if (!tables.includes(table)) {
      throw new Error(`Table name '${table}' is not valid`);
    }
    try {
      const sql = `SELECT * FROM ${table} WHERE user_id = $1`;
      const params: Array<any> = [userId];
      const result = await connection.query(sql, params);
      return result.rows;
    } catch (error) {
      try {
        const sql = `SELECT * FROM ${table} WHERE customer_id = $1`;
        const params: Array<any> = [userId];

        const result = await connection.query(sql, params);
        return result.rows;
      } catch (error) {
        try {
          const userBoxResult = await connection.query(
            `SELECT box_id FROM User_Box WHERE user_id = $1`,
            [userId],
          );
          if (userBoxResult.rows.length === 0) {
            throw new Error(`User with ID ${userId} does not have a box`);
          }
          const boxIds = userBoxResult.rows.map((row) => row.box_id);
          const result = [];

          for (const boxId of boxIds) {
            const sql = `SELECT * FROM ${table} RIGHT JOIN User_Box ON Box_IMAGE.box_id = User_Box.box_id WHERE User_Box.box_id = $1`;
            const boxResult = await connection.query(sql, [boxId]);
            result.push(...boxResult.rows);
          }
          result.forEach((row) => {
            row.image = `${process.env.BASE_URL}/uploads/${row.image}`;
          });
          return result;
        } catch (error: any) {
          try {
            const sql = `
          SELECT User_Box.id AS user_box_id, User_Box.*, Box.id AS box_id, Box.*,
          tablet.serial_number
          FROM ${table}
          LEFT JOIN Box ON User_Box.box_id = Box.id
          LEFT JOIN tablet ON Box.current_tablet_id = tablet.id;
        `;
            const result = await connection.query(sql);
            return result.rows;
          } catch (error) {
            try {
              const userBoxResult = await connection.query(
                `SELECT box_id FROM User_Box WHERE user_id = $1`,
                [userId],
              );
              if (userBoxResult.rows.length === 0) {
                throw new Error(`User with ID ${userId} does not have a box`);
              }

              const boxIds = userBoxResult.rows.map((row) => row.box_id);

              const result = [];
              for (const boxId of boxIds) {
                const sql = `SELECT * FROM ${table} WHERE id = $1 `;
                const boxResult = await connection.query(sql, [boxId]);
                result.push(...boxResult.rows);
              }

              return result;
            } catch (error) {
              throw new Error((error as Error).message);
            }
          }
        }
      }
    } finally {
      connection.release();
    }
  }

  // return all box history data by user_id and box_id
  async getBoxHistory(userId: string, boxId: string): Promise<Array<any>> {
    const connection = await db.connect();

    try {
      // Select from the audit trail table
      const sql = `SELECT * FROM audit_trail WHERE box_id = $2`;
      const result = await connection.query(sql, [userId, boxId]);
      return result.rows;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }
}

export default HistoryModel;
