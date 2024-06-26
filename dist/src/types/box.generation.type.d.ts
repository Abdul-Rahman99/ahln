export interface BoxGeneration {
    id: string;
    model_name: string;
    createdAt: Date;
    updatedAt: Date;
    number_of_doors: number;
    width?: string;
    height?: string;
    color?: string;
    model_image?: string;
    has_outside_camera: boolean;
    has_inside_camera: boolean;
    has_tablet: boolean;
}
