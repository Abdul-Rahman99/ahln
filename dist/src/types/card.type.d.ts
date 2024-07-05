export interface Card {
    id: number;
    card_number: string;
    expire_date: Date;
    cvv: string;
    name_on_card: string;
    billing_address?: number;
    user_id: string;
}
