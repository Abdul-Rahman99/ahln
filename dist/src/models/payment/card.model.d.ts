import { Card } from '../../types/card.type';
declare class CardModel {
    createCard(card: Partial<Card>): Promise<Card>;
    getAllCards(): Promise<Card[]>;
    getCardById(id: number): Promise<Card>;
    updateCard(id: number, cardData: Partial<Card>): Promise<Card>;
    deleteCard(id: number): Promise<Card>;
}
export default CardModel;
