/* eslint-disable @typescript-eslint/no-explicit-any */
import db from '../../config/database';
import { Playback } from '../../types/playback.type';
import moment from 'moment-timezone';

export default class PlaybackModel {
  async createPlayback(
    video_link: string,
    box_id: string,
    tag: string,
  ): Promise<Playback> {
    const connection = await db.connect();

    try {
      const createdAt = moment().tz('Asia/Dubai').format();
      const updatedAt = moment().tz('Asia/Dubai').format();

      const sqlFields = [
        'createdAt',
        'updatedAt',
        'video_link',
        'box_id',
        'tag',
      ];
      const sqlParams = [
        createdAt, // createdAt
        updatedAt, // updatedAt
        video_link, // video_link
        box_id, // box_id
        tag, // tag
      ];
      const sql = `INSERT INTO Playback (${sqlFields.join(', ')}) 
                        VALUES (${sqlParams.map((_, index) => `$${index + 1}`).join(', ')}) 
                         RETURNING *`;

      const result = await connection.query(sql, sqlParams);
      return result.rows[0] as Playback;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  async getAllPlaybackByBox(
    box_id: string,
    fromDate?: string,
    toDate?: string,
    limit?: number,
    page?: any,
  ): Promise<Playback[]> {
    const connection = await db.connect();
    try {
      let sql = `SELECT * FROM Playback WHERE box_id = $1 `;
      const sqlParams: string[] = [box_id];

      if (fromDate) {
        sql += ` AND createdat >= $2`;
        sqlParams.push(fromDate);
      }
      if (toDate) {
        sql += ` AND createdat <= $3`;
        sqlParams.push(toDate);
      }

      sql += ` ORDER BY createdat DESC`;

      if (limit) {
        sql += ` LIMIT $${sqlParams.length + 1} OFFSET $${
          sqlParams.length + 2
        }`;
        sqlParams.push(limit.toString());
        sqlParams.push(((page - 1) * limit).toString());
      }

      const result = await connection.query(sql, sqlParams);

      const rows = result.rows.map((row) => {
        return {
          ...row,
          video_link: `${process.env.BASE_URL}/uploads/${row.video_link}`,
        };
      });

      return rows as Playback[];
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }
}
