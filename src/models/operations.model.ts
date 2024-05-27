import Operations from '../types/operations.type';
import db from '../config/database';

class OperationsModel {
  //create operations
  async create(o: Operations): Promise<Operations> {
    try {
      const connection = await db.connect();
      const sql = `INSERT INTO operations (delivery_id, state_method) 
                   VALUES ($1, $2) 
                   RETURNING id, delivery_id, state_method , createdAt, updatedAt, operations_id`;
      const result = await connection.query(sql, [
        o.delivery_id,
        o.state_method,
      ]);
      connection.release();
      const operations = result.rows[0];
      return operations;
    } catch (error) {
      throw new Error(
        `Unable to create operation: ${(error as Error).message}`,
      );
    }
  }
}

export default OperationsModel;
