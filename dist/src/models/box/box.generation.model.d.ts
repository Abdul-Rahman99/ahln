import { BoxGeneration } from '../../types/box.generation.type';
declare class BoxGenerationModel {
    generateBoxGenerationId(): Promise<string>;
    createBoxGeneration(b: Partial<BoxGeneration>): Promise<BoxGeneration>;
    getMany(): Promise<BoxGeneration[]>;
    getOne(id: string): Promise<BoxGeneration>;
    updateOne(b: Partial<BoxGeneration>, id: string): Promise<BoxGeneration>;
    deleteOne(id: string): Promise<BoxGeneration>;
    modelNameExists(model_name: string): Promise<boolean>;
}
export default BoxGenerationModel;
