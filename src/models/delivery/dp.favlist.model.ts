import db from '../../config/database';
import { DPFavList } from '../../types/dp.favlist.type';

class DPFavListModel {
  // Create DP_Fav_List
  async createDPFavList(
    dpFavListData: Partial<DPFavList>,
    user: string,
  ): Promise<DPFavList> {
    const connection = await db.connect();

    try {
      const createdAt = new Date();
      const updatedAt = new Date();

      const sqlFields = [
        'createdAt',
        'updatedAt',
        'delivery_package_id',
        'user_id',
      ];
      const sqlParams = [
        createdAt,
        updatedAt,
        dpFavListData.delivery_package_id,
        user,
      ];

      const sql = `INSERT INTO DP_Fav_List (${sqlFields.join(', ')}) 
                  VALUES (${sqlParams.map((_, index) => `$${index + 1}`).join(', ')}) 
                   RETURNING *`;
      const result = await connection.query(sql, sqlParams);

      const sql2 = `UPDATE Delivery_Package SET is_fav = true WHERE id=$1`;
      await connection.query(sql2, [dpFavListData.delivery_package_id]);

      return result.rows[0];
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // // Get all DP_Fav_Lists
  // async getAllDPFavLists(): Promise<DPFavList[]> {
  //   const connection = await db.connect();

  //   try {
  //     const sql = 'SELECT * FROM DP_Fav_List';
  //     const result = await connection.query(sql);

  //     return result.rows as DPFavList[];
  //   } catch (error) {
  //     throw new Error((error as Error).message);
  //   } finally {
  //     connection.release();
  //   }
  // }

  // Get specific DP_Fav_List by ID
  async getDPFavListById(id: string): Promise<DPFavList> {
    const connection = await db.connect();

    try {
      if (!id) {
        throw new Error('Please provide an ID');
      }
      const sql = 'SELECT * FROM DP_Fav_List WHERE delivery_package_id=$1';
      const result = await connection.query(sql, [id]);

      return result.rows[0] as DPFavList;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Update DP_Fav_List
  // async updateDPFavList(
  //   id: number,
  //   dpFavListData: Partial<DPFavList>,
  // ): Promise<DPFavList> {
  //   const connection = await db.connect();
  //   try {
  //     const updatedAt = new Date();

  //     const updateFields = Object.keys(dpFavListData)
  //       .map((key, index) => `${key}=$${index + 2}`)
  //       .join(', ');

  //     const sql = `UPDATE DP_Fav_List SET ${updateFields}, updatedAt=$${Object.keys(dpFavListData).length + 2} WHERE id=$1 RETURNING *`;

  //     const params = [id, ...Object.values(dpFavListData), updatedAt];
  //     const result = await connection.query(sql, params);

  //     return result.rows[0] as DPFavList;
  //   } catch (error) {
  //     throw new Error((error as Error).message);
  //   } finally {
  //     connection.release();
  //   }
  // }

  // Delete DP_Fav_List
  async deleteDPFavList(id: string): Promise<DPFavList> {
    const connection = await db.connect();

    try {
      if (!id) {
        throw new Error(
          'ID cannot be null. Please provide a valid Delivery Package ID.',
        );
      }
      const sql = `DELETE FROM DP_Fav_List WHERE delivery_package_id=$1 RETURNING *`;

      const result = await connection.query(sql, [id]);

      if (result.rows.length === 0) {
        throw new Error(`Could not find DP_Fav_List with ID ${id}`);
      }

      const sql2 = `UPDATE Delivery_Package SET is_fav=false WHERE id=$1`;
      await connection.query(sql2, [id]);

      return result.rows[0] as DPFavList;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Get DP_Fav_Lists by User
  async getDPFavListsByUser(userId: string): Promise<DPFavList[]> {
    const connection = await db.connect();

    try {
      if (!userId) {
        throw new Error('ID cannot be null. Please provide a valid User ID.');
      }

      const sql = `SELECT Delivery_Package.other_shipping_company, Box.box_label ,Box_Locker.locker_label , Delivery_Package.is_fav,
        Delivery_Package.id, Shipping_Company.title AS shipping_company_name ,tracking_number, Delivery_Package.box_id, box_locker_id, 
        shipping_company_id, shipment_status, Delivery_Package.title AS name, delivery_pin, description, Delivery_Package.createdAt 
        FROM DP_Fav_List
        INNER JOIN Delivery_Package ON Delivery_Package.id = DP_Fav_List.delivery_package_id
        LEFT JOIN Shipping_Company ON shipping_company_id = Shipping_Company.id 
        INNER JOIN Box_Locker ON Delivery_Package.box_locker_id = Box_Locker.id 
        INNER JOIN Box ON Delivery_Package.box_id = Box.id 
        WHERE DP_Fav_List.user_id = $1`;

      const result = await connection.query(sql, [userId]);

      return result.rows as DPFavList[];
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }
}

export default DPFavListModel;
