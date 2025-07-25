
export interface Order {
  date: string; // ISO string format
  orderFy: string;
  partyName: string;
  amount: number;
  reserve: number;
  total: number;
  orderNo: string;
  segment: string;
  reqReserve12: number;
}

export interface GPData {
  country: string;
  segment: string;
  bonhorfferCode: string;
  exportValue: number;
  importValue: number;
  gp: number;
}
