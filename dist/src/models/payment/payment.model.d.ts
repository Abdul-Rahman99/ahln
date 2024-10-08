import { Payment } from '../../types/payment.type';
declare class PaymentModel {
    createPayment(payment: Partial<Payment>, user: string): Promise<Payment>;
    getAllPayments(): Promise<Payment[]>;
    getPaymentById(id: number): Promise<Payment>;
    updatePayment(id: number, paymentData: Partial<Payment>): Promise<Payment>;
    deletePayment(id: number): Promise<Payment>;
    getPaymentsByUser(userId: string): Promise<Payment[]>;
    getUserByPayment(id: number): Promise<string>;
}
export default PaymentModel;
