import { PIN } from '../../types/pin.type';
import db from '../../config/database';
import moment from 'moment-timezone';
import AuditTrailModel from '../logs/audit.trail.model';
import i18n from '../../config/i18n';

const auditTrail = new AuditTrailModel();

class PINModel {
  // create PIN
  async createPIN(pinData: Partial<PIN>, user: string): Promise<PIN> {
    const connection = await db.connect();
    try {
      const createdAt = moment().tz('Asia/Dubai').format();
      const updatedAt = moment().tz('Asia/Dubai').format();

      const sqlFields = [
        'createdAt',
        'updatedAt',
        'reciepent_email',
        'title',
        'is_active',
        'time_range',
        'day_range',
        'box_id',
        'user_id',
        'type',
        'passcode',
        'end_date',
      ];

      // Ensure time_range and day_range are arrays
      const timeRangeString = Array.isArray(pinData.time_range)
        ? pinData.time_range.join(',')
        : '';
      const dayRangeString = Array.isArray(pinData.day_range)
        ? pinData.day_range.join(',')
        : '';

      const sqlParams = [
        createdAt,
        updatedAt,
        pinData.reciepent_email,
        pinData.title,
        pinData.is_active || true,
        timeRangeString,
        dayRangeString,
        pinData.box_id,
        user,
        pinData.type,
        pinData.passcode,
        pinData.end_date,
      ];

      const sql = `INSERT INTO PIN (${sqlFields.join(', ')}) 
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

  // get all pin management
  async getAllPinByUser(user: string, boxId?: string): Promise<PIN[]> {
    const connection = await db.connect();
    try {
      let sql =
        'SELECT b.box_label, PIN.* FROM PIN INNER JOIN Box as b ON b.id=PIN.box_id WHERE user_id=$1';
      const params = [user];

      if (boxId) {
        sql += ' AND PIN.box_id = $2';
        params.push(boxId);
      }

      sql += ' ORDER BY createdat DESC';

      const result = await connection.query(sql, params);
      const results = result.rows.map((row) => {
        const endDate = moment(row.end_date).add(1, 'day');
        return {
          ...row,
          end_date: endDate.toDate(),
        };
      });

      return results as PIN[];
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // get one pin management by user
  async getOnePinByUser(id: number, user: string): Promise<PIN[]> {
    const connection = await db.connect();
    try {
      const sql = 'SELECT * FROM PIN WHERE id=$1 AND user_id=$2';
      const result = await connection.query(sql, [id, user]);
      return result.rows as PIN[];
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // get one pin management
  async getOnePinByPasscodeAndBox(
    pass: string,
    boxId: string,
  ): Promise<boolean> {
    const connection = await db.connect();
    try {
      const sql = 'SELECT * FROM PIN WHERE passcode=$1 AND box_id=$2';
      const result = await connection.query(sql, [pass, boxId]);
      if (result.rows.length > 0) {
        return true;
      }
      return false;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // get one pin management
  async getUserByPasscode(pass: string): Promise<string> {
    const connection = await db.connect();
    try {
      const sql = 'SELECT user_id FROM PIN WHERE passcode=$1';
      const result = await connection.query(sql, [pass]);
      if (result.rows.length === 0) {
        throw new Error('No Pin Founded for user by this passcode');
      }
      return result.rows[0].user_id;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // delete Pin
  async deleteOnePinByUser(id: number, user: string): Promise<PIN> {
    const connection = await db.connect();
    try {
      const sql = 'DELETE FROM PIN WHERE id=$1 AND user_id=$2 RETURNING *';
      const result = await connection.query(sql, [id, user]);
      return result.rows[0] as PIN;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // update Pin
  async updatePinByUser(
    pinData: Partial<PIN>,
    id: number,
    user: string,
  ): Promise<PIN> {
    const connection = await db.connect();
    try {
      // Check if the pin exists for this user
      const checkSql = 'SELECT * FROM PIN WHERE id=$1 AND user_id=$2';
      const checkResult = await connection.query(checkSql, [id, user]);

      if (checkResult.rows.length === 0) {
        throw new Error(`PIN with ID ${id} does not exist`);
      }
      const queryParams: unknown[] = [];
      let paramIndex = 1;

      const updatedAt = moment().tz('Asia/Dubai').format();
      const updateFields = Object.keys(pinData)
        .map((key) => {
          if (
            pinData[key as keyof PIN] !== undefined &&
            key !== 'id' &&
            key !== 'createdAt'
          ) {
            if (key === 'time_range' || key === 'day_range') {
              const valueArray = pinData[key as keyof PIN];
              if (
                Array.isArray(valueArray) &&
                valueArray.every((item) => typeof item === 'string')
              ) {
                const valueString = (valueArray as string[])
                  .map((time) => time.trim())
                  .join(',');
                queryParams.push(valueString);
                return `${key}=$${paramIndex++}`;
              }
            }
            queryParams.push(pinData[key as keyof PIN]);
            return `${key}=$${paramIndex++}`;
          }
          return null;
        })
        .filter((field) => field !== null);

      queryParams.push(updatedAt);
      updateFields.push(`updatedAt=$${paramIndex++}`);

      queryParams.push(id);

      const sql = `UPDATE PIN SET ${updateFields.join(', ')} WHERE id=$${paramIndex} RETURNING *`;

      const result = await connection.query(sql, queryParams);

      return result.rows[0] as PIN;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  async checkPIN(
    passcode: string,
    box_id: string,
    user_id: string,
  ): Promise<boolean> {
    const connection = await db.connect();
    try {
      if (!passcode) {
        throw new Error('Please provide a PIN');
      }

      const pinResult = await connection.query(
        'SELECT time_range, day_range, end_date, type, id FROM PIN WHERE passcode = $1 AND is_active = TRUE AND box_id = $2',
        [passcode, box_id],
      );

      if (pinResult.rows.length === 0) {
        const action = 'checkPIN';
        auditTrail.createAuditTrail(
          user_id,
          action,
          i18n.__('PIN_NOT_FOUND_OR_ALREADY_USED'),
          box_id,
        );
        throw new Error('PIN not found or PIN is not activated');
      }

      const { time_range, day_range, end_date, type, id } = pinResult.rows[0];
      let parsedTimeRange, parsedDayRange;
      try {
        parsedTimeRange = time_range
          .split(',')
          .map((item: string) => item.trim());
        parsedDayRange = day_range
          .split(',')
          .map((item: string) => item.trim());
      } catch (error) {
        throw new Error('Update your pin time and day range');
      }

      const currentTime = moment().tz('Asia/Dubai');
      const currentDay = currentTime.day().toString();
      if (type === 'Timed') {
        const parsedEndDate = moment(end_date, 'DD-MM-YYYY')
          .tz('Asia/Dubai')
          .format('DD-MM-YYYY')
          .toString();

        const parsedCurrentDay = currentTime
          .tz('Asia/Dubai')
          .format('DD-MM-YYYY')
          .toString();
        if (parsedEndDate >= parsedCurrentDay) {
          const action = 'checkPIN';
          auditTrail.createAuditTrail(
            user_id,
            action,
            i18n.__('PIN_CHEKED_SUCCESSFULLY'),
            box_id,
          );
        } else {
          const action = 'checkPIN';
          auditTrail.createAuditTrail(
            user_id,
            action,
            i18n.__('PIN_EXPIRED'),
            box_id,
          );
          throw new Error('PIN expired');
        }
      } else if (type === 'One-Time') {
        const action = 'checkPIN';
        auditTrail.createAuditTrail(
          user_id,
          action,
          i18n.__('PIN_ALREADY_USED'),
          box_id,
        );
        const deletePIN = await this.deleteOnePinByUser(id, user_id);

        if (!deletePIN) {
          throw new Error('Failed to delete PIN');
        }
        return true;
      }

      if (!parsedDayRange.includes(currentDay)) {
        return false;
      }

      const currentTotalMin = currentTime.hours() * 60 + currentTime.minutes();

      for (let i = 0; i < parsedTimeRange.length; i += 2) {
        const startTimeStr = parsedTimeRange[i];
        const endTimeStr = parsedTimeRange[i + 1];
        let [startHour, startMin] = [0, 0];
        let [endHour, endMin] = [0, 0];
        try {
          [startHour, startMin] = startTimeStr.split(':').map(Number);

          [endHour, endMin] = endTimeStr.split(':').map(Number);
        } catch (error) {
          throw new Error('Update your PIN to add a time range');
        }
        if (
          isNaN(startHour) ||
          isNaN(startMin) ||
          isNaN(endHour) ||
          isNaN(endMin)
        ) {
          throw new Error('Invalid time range format');
        }

        const startTotalMin = startHour * 60 + startMin;
        const endTotalMin = endHour * 60 + endMin;

        if (
          currentTotalMin >= startTotalMin &&
          currentTotalMin <= endTotalMin
        ) {
          return true;
        }
      }

      return false;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }
}

export default PINModel;
