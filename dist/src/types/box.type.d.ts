export interface Box {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    serial_number: string;
    box_label: string;
    has_empty_lockers: boolean;
    current_tablet_id: number;
    previous_tablet_id?: number;
    box_model_id: string;
    address_id: number;
}
