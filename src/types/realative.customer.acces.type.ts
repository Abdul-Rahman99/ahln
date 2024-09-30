export interface RelativeCustomerAccess {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  relative_customer_id: string;
  box_id: string;

  add_shipment: boolean;
  read_owner_shipment: boolean;
  read_own_shipment: boolean;

  create_pin: boolean;
  create_offline_otps: boolean;
  create_otp: boolean;

  open_door1: boolean;
  open_door2: boolean;
  open_door3: boolean;

  read_playback: boolean;
  read_notification: boolean;

  craete_realative_customer: boolean;

  transfer_box_ownership: boolean;
  read_history: boolean;

  update_box_screen_message: boolean;

  read_live_stream: boolean;

  update_box_data: boolean;
}
