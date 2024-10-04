/* eslint-disable @typescript-eslint/no-explicit-any */
import { RelativeCustomer } from '../../types/relative.customer.type';
import db from '../../config/database';

class RelativeCustomerModel {
  // create new relative customer
  async createRelativeCustomer(
    newRelaticeCustomerData: Partial<RelativeCustomer>,
  ): Promise<RelativeCustomer> {
    const connection = await db.connect();
    await connection.query('BEGIN');
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
        'box_id',
      ];
      const sqlParams: unknown[] = [
        createdAt,
        updatedAt,
        newRelaticeCustomerData.customer_id,
        newRelaticeCustomerData.relative_customer_id,
        newRelaticeCustomerData.relation,
        newRelaticeCustomerData.box_id,
      ];

      const sql = `INSERT INTO Relative_Customer (${sqlFields.join(', ')}) 
                VALUES (${sqlParams.map((_, index) => `$${index + 1}`).join(', ')}) 
                RETURNING *`;

      const result = await connection.query(sql, sqlParams);
      await connection.query('COMMIT');
      return result.rows[0] as RelativeCustomer;
    } catch (error) {
      await connection.query('ROLLBACK');
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // get all relative customers by user auth
  async getMany(user: string): Promise<RelativeCustomer[]> {
    const connection = await db.connect();

    try {
      const sql = `SELECT Box.box_label, users.user_name, users.email ,users.phone_number, relative_customer.*,
        FROM relative_customer 
        INNER JOIN users ON users.id = relative_customer.relative_customer_id 
        INNER JOIN Box ON Box.id=relative_customer.box_id
        WHERE relative_customer.customer_id=$1 
        ORDER BY relative_customer.createdat DESC`;

      const result = await connection.query(sql, [user]);

      return result.rows as RelativeCustomer[];
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  async getAllForAdmin(): Promise<RelativeCustomer[]> {
    const connection = await db.connect();

    try {
      const sql = `SELECT Box.box_label, users.user_name, users.email ,users.phone_number, 
        Relative_Customer.is_active,Relative_Customer.id, Relative_Customer.relation,
        Relative_Customer.box_id, Relative_Customer.customer_id, Relative_Customer.relative_customer_id FROM Relative_Customer 
        INNER JOIN users ON users.id=Relative_Customer.relative_customer_id INNER JOIN Box ON Box.id=Relative_Customer.box_id ORDER BY Relative_Customer.createdat DESC`;
      const result = await connection.query(sql);
      return result.rows as RelativeCustomer[];
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // get specific relative customer
  async getOne(
    relative_customer_id: string,
    box_id: string,
  ): Promise<RelativeCustomer> {
    const connection = await db.connect();

    try {
      //fetch user from db
      const sql = `SELECT * FROM Relative_Customer 
                    WHERE relative_customer_id=$1 AND box_id=$2`;
      const result = await connection.query(sql, [
        relative_customer_id,
        box_id,
      ]);

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
      // check if the main user already exist
      const mainUser = 'SELECT customer_id FROM Relative_Customer WHERE id=$1';
      const checkMainUser = await connection.query(mainUser, [id]);
      if (!checkMainUser.rows.length) {
        throw new Error(`Main Customer with ID does not exist`);
      }
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

      queryParams.push(id); // Add the rc ID to the query parameters

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
      const sqlRelativeCustomer = `SELECT * FROM Relative_Customer WHERE id=$1`;
      const resultRelativeCustomer = await connection.query(
        sqlRelativeCustomer,
        [id],
      );

      const sqlUserBoxDelete = `DELETE FROM User_Box WHERE user_id=$1 AND box_id=$2`;
      const resultUserBox = await connection.query(sqlUserBoxDelete, [
        resultRelativeCustomer.rows[0].relative_customer_id,
        resultRelativeCustomer.rows[0].box_id,
      ]);
      if (!resultUserBox) {
        throw new Error('error in deleting user box');
      }

      if (!id) {
        //check required id
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

  // Update Relative Customer Status
  async updateStatus(id: number, status: boolean): Promise<RelativeCustomer> {
    const connection = await db.connect();
    try {
      if (!id) {
        throw new Error('ID cannot be null. Please provide a valid ID.');
      } else if (status === null || status === undefined) {
        throw new Error('Please provide a valid status');
      }
      const sql = `UPDATE Relative_Customer SET is_active = $1 WHERE id = $2 RETURNING *`;
      const result = await connection.query(sql, [status, id]);
      return result.rows[0] as RelativeCustomer;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }
}

export default RelativeCustomerModel;
