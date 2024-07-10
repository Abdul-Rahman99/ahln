/* eslint-disable @typescript-eslint/no-explicit-any */
import { RelativeCustomer } from '../../types/relative.customer.type';
import db from '../../config/database';

class RelativeCustomerModel {
  // create new relative customer
  async createRelativeCustomer(
    newRelaticeCustomerData: Partial<RelativeCustomer>,
  ): Promise<RelativeCustomer> {
    const connection = await db.connect();

    try {
      const createdAt = new Date();
      const updatedAt = new Date();

      // Prepare SQL query based on provided fields
      const sqlFields: string[] = [
        'createdAt',
        'updatedAt',
        'customer_id',
        'relative_customer_id',
        'relation',
      ];
      const sqlParams: unknown[] = [
        createdAt,
        updatedAt,
        newRelaticeCustomerData.customer_id,
        newRelaticeCustomerData.relative_customer_id,
        newRelaticeCustomerData.relation,
      ];

      const sql = `INSERT INTO Relative_Customer (${sqlFields.join(', ')}) 
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

  // get all relative customers
  async getMany(user: string): Promise<RelativeCustomer[]> {
    const connection = await db.connect();

    try {
      const sql =
        'SELECT users.user_name, users.phone_number, Relative_Customer.is_active, Relative_Customer.relation FROM Relative_Customer INNER JOIN users ON users.id=Relative_Customer.relative_customer_id WHERE Relative_Customer.customer_id=$1';
      const result = await connection.query(sql, [user]);
      return result.rows as RelativeCustomer[];
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // get specific relative customer
  async getOne(id: number): Promise<RelativeCustomer> {
    const connection = await db.connect();

    try {
      if (!id) {
        throw new Error('ID cannot be null. Please provide a valid ID.');
      }

      //fetch user from db
      const sql = `SELECT * FROM Relative_Customer 
                    WHERE id=$1`;
      const result = await connection.query(sql, [id]);

      return result.rows[0] as RelativeCustomer;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // get specific relative customer
  async getRelativeCustomerByCustomerId(id: string): Promise<RelativeCustomer> {
    const connection = await db.connect();

    try {
      if (!id) {
        throw new Error(
          'ID cannot be null. Please provide a valid Cutomer ID.',
        );
      }

      //fetch user from db
      const sql = `SELECT * FROM Relative_Customer 
                    WHERE customer_id=$1`;
      const result = await connection.query(sql, [id]);

      return result.rows[0] as RelativeCustomer;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // update Relative Customer in db
  async updateOne(
    relativeCustomerData: Partial<RelativeCustomer>,
    id: number,
  ): Promise<RelativeCustomer> {
    const connection = await db.connect();
    try {
      // Check if the relative cutomer already exists
      const checkSql = 'SELECT * FROM Relative_Customer WHERE id=$1';
      const checkResult = await connection.query(checkSql, [id]);

      if (checkResult.rows.length === 0) {
        throw new Error(`Relative Customer with ID ${id} does not exist`);
      }
      const queryParams: unknown[] = [];
      let paramIndex = 1;

      const updatedAt = new Date();

      const updateFields = Object.keys(relativeCustomerData)
        .map((key) => {
          if (
            relativeCustomerData[key as keyof RelativeCustomer] !== undefined &&
            key !== 'id' &&
            key !== 'createdAt'
          ) {
            queryParams.push(
              relativeCustomerData[key as keyof RelativeCustomer],
            );
            return `${key}=$${paramIndex++}`;
          }
          return null;
        })
        .filter((field) => field !== null);

      queryParams.push(updatedAt); // Add the updatedAt timestamp
      updateFields.push(`updatedAt=$${paramIndex++}`); // Include updatedAt field in the update query

      queryParams.push(id); // Add the address ID to the query parameters

      const sql = `UPDATE Relative_Customer SET ${updateFields.join(', ')} WHERE id=$${paramIndex} RETURNING *`;

      const result = await connection.query(sql, queryParams);

      return result.rows[0] as RelativeCustomer;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // delete user
  async deleteOne(id: number): Promise<RelativeCustomer> {
    const connection = await db.connect();

    try {
      //check required id
      if (!id) {
        throw new Error('ID cannot be null. Please provide a valid ID.');
      }

      const sql = `DELETE FROM Relative_Customer WHERE id=$1 RETURNING *`;
      const result = await connection.query(sql, [id]);

      return result.rows[0] as RelativeCustomer;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  //
}

export default RelativeCustomerModel;
