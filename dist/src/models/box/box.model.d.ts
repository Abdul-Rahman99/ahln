import { Box } from '../../types/box.type';
declare class BoxModel {
    private boxLockerModel;
    createBox(box: Partial<Box>): Promise<Box>;
    getMany(): Promise<Box[]>;
    getOne(id: string): Promise<Box>;
    updateOne(box: Partial<Box>, id: string): Promise<Box>;
    deleteOne(id: string): Promise<Box>;
    getBoxesByGenerationId(boxGenerationId: string): Promise<Box[]>;
}
export default BoxModel;
