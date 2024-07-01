export interface BoxImage {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  box_id: string;
  image: string;
  delivery_package_id?: number;
}
