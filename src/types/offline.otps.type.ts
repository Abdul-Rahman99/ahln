export interface OfflineOtp {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  locker1_list: Array<string>;
  locker2_list: Array<string>;
  locker3_list: Array<string>;
  box_id: string;
}
