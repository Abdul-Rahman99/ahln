import { Card } from '../../types/card.type';
declare class CardModel {
    createCard(card: Partial<Card>): Promise<Card>;
    getAllCards(): Promise<Card[]>;
    getCardById(id: string): Promise<Card>;
    updateCard(id: string, cardData: Partial<Card>): Promise<Card>;
    deleteCard(id: string): Promise<Card>;
}
export default CardModel;
