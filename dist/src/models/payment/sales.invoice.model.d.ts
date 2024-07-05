import { SalesInvoice } from '../../types/sales.invoice.type';
declare class SalesInvoiceModel {
    generateSalesInvoiceId(): Promise<string>;
    createSalesInvoice(newSalesInvoice: Partial<SalesInvoice>): Promise<SalesInvoice>;
    getAllSalesInvoices(): Promise<SalesInvoice[]>;
    getOne(id: string): Promise<SalesInvoice>;
    updateOne(salesInvoice: Partial<SalesInvoice>, id: string): Promise<SalesInvoice>;
    deleteOne(id: string): Promise<SalesInvoice>;
    getSalesInvoicesByUserId(user: string): Promise<SalesInvoice[]>;
    getSalesInvoicesBySalesId(user: string): Promise<SalesInvoice[]>;
    getSalesInvoicesByBoxId(boxId: string): Promise<SalesInvoice[]>;
}
export default SalesInvoiceModel;
