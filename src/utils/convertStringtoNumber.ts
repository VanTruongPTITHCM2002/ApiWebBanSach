import { InvoiceStatus } from 'src/enum/InvoiceStatus';

const statusMap: Record<string, number> = {
  [InvoiceStatus.PENDING.toString()]: 0,
  [InvoiceStatus.PAID.toString()]: 1,
  [InvoiceStatus.CANCELED.toString()]: 2,
};

export function convertStatusToNumber(status: string): number {
  return statusMap[status];
}
