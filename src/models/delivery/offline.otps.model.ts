import db from '../../config/database';
import { OfflineOtp } from '../../types/offline.otps.type';

class OfflineOtps {
  async create(offlineOtp: Partial<OfflineOtp>): Promise<OfflineOtp> {
    const connection = await db.connect();
    try {
      const createdAt = new Date();
      const updatedAt = new Date();

      const sqlFields = [
        'createdAt',
        'updatedAt',
        'locker1_list',
        'locker2_list',
        'locker3_list',
        'box_id',
      ];
      // Ensure the locker lists are arrays
      const locker1List = Array.isArray(offlineOtp.locker1_list)
        ? offlineOtp.locker1_list.join(',')
        : '';
      const locker2List = Array.isArray(offlineOtp.locker2_list)
        ? offlineOtp.locker2_list.join(',')
        : '';
      const locker3List = Array.isArray(offlineOtp.locker3_list)
        ? offlineOtp.locker3_list.join(',')
        : '';

      const sqlParams = [
        createdAt,
        updatedAt,
        locker1List,
        locker2List,
        locker3List,
        offlineOtp.box_id,
      ];

      const sql = `INSERT INTO offline_otps (${sqlFields.join(', ')}) 
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

  // create offline otps
  async createOfflineOtps(boxId: string): Promise<OfflineOtp> {
    const connection = await db.connect();
    try {
      const sql = 'SELECT * FROM offline_otps WHERE box_id=$1';
      const result = await connection.query(sql, [boxId]);

      // if result is empty, create a 100 otps in every locker
      if (result.rows.length === 0) {
        const locker1List: string[] = [];
        const locker2List: string[] = [];
        const locker3List: string[] = [];
        for (let i = 0; i < 10000; i++) {
          locker1List.push(`${Math.floor(100000 + Math.random() * 900000)}`);
          locker2List.push(`${Math.floor(100000 + Math.random() * 900000)}`);
          locker3List.push(`${Math.floor(100000 + Math.random() * 900000)}`);
        }
        const result = await this.create({
          locker1_list: locker1List,
          locker2_list: locker2List,
          locker3_list: locker3List,
          box_id: boxId,
        });

        return result;
        // if there is a record delete it and create a 100 otps in every locker
      } else {
        await connection.query('DELETE FROM offline_otps WHERE box_id=$1', [
          boxId,
        ]);
        const locker1List: string[] = [];
        const locker2List: string[] = [];
        const locker3List: string[] = [];
        for (let i = 0; i < 10000; i++) {
          locker1List.push(`${Math.floor(100000 + Math.random() * 900000)}`);
          locker2List.push(`${Math.floor(100000 + Math.random() * 900000)}`);
          locker3List.push(`${Math.floor(100000 + Math.random() * 900000)}`);
        }

        const result = await this.create({
          locker1_list: locker1List,
          locker2_list: locker2List,
          locker3_list: locker3List,
          box_id: boxId,
        });

        return result;
      }
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // get all offline otps
  async getAllOfflineOtps(boxId: string): Promise<OfflineOtp[]> {
    const connection = await db.connect();
    try {
      const sql = 'SELECT * FROM offline_otps WHERE box_id=$1 ORDER BY id DESC';
      const result = await connection.query(sql, [boxId]);
      return result.rows[0];
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }
}

export default OfflineOtps;
