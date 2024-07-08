import { DPFavList } from '../../types/dp.favlist.type';
declare class DPFavListModel {
    createDPFavList(dpFavListData: Partial<DPFavList>, user: string): Promise<DPFavList>;
    deleteDPFavList(id: number): Promise<DPFavList>;
    getDPFavListsByUser(userId: string): Promise<DPFavList[]>;
}
export default DPFavListModel;
