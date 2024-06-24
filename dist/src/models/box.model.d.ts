import Box from '../types/box.type';
declare class BoxModel {
    create(b: Box): Promise<Box>;
    getMany(): Promise<Box[]>;
    getOne(id: string): Promise<Box>;
    updateOne(b: Partial<Box>, id: string): Promise<Box>;
    deleteOne(id: string): Promise<Box>;
}
export default BoxModel;
