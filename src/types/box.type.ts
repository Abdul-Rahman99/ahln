type CompartmentStatus = {
  [key: string]: boolean;
};

type Box = {
  id?: string;
  compartments_number: number;
  compartments_status: CompartmentStatus;
  video_id: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export default Box;
