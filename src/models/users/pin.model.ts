// import { PIN } from '../../types/pin.type';
// import db from '../../config/database';

// class PINModel {
//   // create PIN
//   async createPIN(pinData: Partial<PIN>, user: string): Promise<PIN> {
//     const connection = await db.connect();
//     try {
//       const createdAt = new Date();
//       const updatedAt = new Date();

//       const sqlFields = [
//         'createdAt',
//         'updatedAt',
//         'reciepent_email',
//         'title',
//         'is_active',
//         'time_range',
//         'day_range',
//         'box_id',
//         'user_id',
//         'type',
//         'passcode',
//       ];
//       const sqlParams = [
//         createdAt,
//         updatedAt,
//         pinData.reciepent_email,
//         pinData.title,
//         pinData.is_active || true,
//         pinData.time_range,
//         pinData.day_range,
//         pinData.box_id,
//         user,
//         pinData.type,
//         pinData.passcode,
//       ];
//       const sql = `INSERT INTO PIN (${sqlFields.join(', ')}) 
//                   VALUES (${sqlParams.map((_, index) => `$${index + 1}`).join(', ')}) 
//                   RETURNING *`;

//       const result = await connection.query(sql, sqlParams);

//       return result.rows[0];
//     } catch (error) {
//       throw new Error((error as Error).message);
//     } finally {
//       connection.release();
//     }
//   }

//   // get all pin management
//   async getAllPinByUser(user: string): Promise<PIN[]> {
//     const connection = await db.connect();
//     try {
//       const sql = 'SELECT * FROM PIN WHERE user_id=$1';
//       const result = await connection.query(sql, [user]);

//       return result.rows as PIN[];
//     } catch (error) {
//       throw new Error((error as Error).message);
//     } finally {
//       connection.release();
//     }
//   }

//   // get one pin management
//   async getOnePinByUser(id: number, user: string): Promise<PIN[]> {
//     const connection = await db.connect();
//     try {
//       const sql = 'SELECT * FROM PIN WHERE id=$1 AND user_id=$2';
//       const result = await connection.query(sql, [id, user]);
//       return result.rows as PIN[];
//     } catch (error) {
//       throw new Error((error as Error).message);
//     } finally {
//       connection.release();
//     }
//   }

//   // delete Pin
//   async deleteOnePinByUser(id: number, user: string): Promise<PIN[]> {
//     const connection = await db.connect();
//     try {
//       const sql = 'DELETE FROM PIN WHERE id=$1 AND user_id=$2';
//       const result = await connection.query(sql, [id, user]);
//       return result.rows as PIN[];
//     } catch (error) {
//       throw new Error((error as Error).message);
//     } finally {
//       connection.release();
//     }
//   }

//   // update Pin
//   async updatePinByUser(
//     pinData: Partial<PIN>,
//     id: number,
//     user: string,
//   ): Promise<PIN> {
//     const connection = await db.connect();
//     try {
//       // Check if the pin exists for this user
//       const checkSql = 'SELECT * FROM PIN WHERE id=$1 AND user_id=$2';
//       const checkResult = await connection.query(checkSql, [id, user]);

//       if (checkResult.rows.length === 0) {
//         throw new Error(`PIN with ID ${id} does not exist`);
//       }
//       const queryParams: unknown[] = [];
//       let paramIndex = 1;

//       const updatedAt = new Date();

//       const updateFields = Object.keys(pinData)
//         .map((key) => {
//           if (
//             pinData[key as keyof PIN] !== undefined &&
//             key !== 'id' &&
//             key !== 'createdAt'
//           ) {
//             queryParams.push(pinData[key as keyof PIN]);
//             return `${key}=$${paramIndex++}`;
//           }
//           return null;
//         })
//         .filter((field) => field !== null);

//       queryParams.push(updatedAt); // Add the updatedAt timestamp
//       updateFields.push(`updatedAt=$${paramIndex++}`); // Include updatedAt field in the update query

//       queryParams.push(id); // Add the pin ID to the query parameters

//       const sql = `UPDATE PIN SET ${updateFields.join(', ')} WHERE id=$${paramIndex} RETURNING *`;

//       const result = await connection.query(sql, queryParams);

//       return result.rows[0] as PIN;
//     } catch (error) {
//       throw new Error((error as Error).message);
//     } finally {
//       connection.release();
//     }
//   }

//   async checkPIN(passcode: string, box_id: string): Promise<boolean> {
//     const connection = await db.connect();
//     try {
//       if (!passcode) {
//         throw new Error('Please provide a PIN');
//       }

//       // Check if PIN exists and is active and passcode is correct
//       const pinResult = await connection.query(
//         'SELECT time_range, day_range FROM PIN WHERE passcode = $1 AND is_active = TRUE AND  box_id = $2',
//         [passcode, box_id],
//       );

//       if (pinResult.rows.length === 0) {
//         throw new Error('PIN not found or pin is not activated');
//       }

//       const { time_range, day_range } = pinResult.rows[0];
//       const timeNow = new Date()
//     } catch (error) {
//       throw new Error((error as Error).message);
//     } finally {
//       connection.release();
//     }
//   }
// }

// export default PINModel;
