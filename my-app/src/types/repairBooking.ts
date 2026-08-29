export interface RepairBooking {
  id: number;
  repairId: number;
  repairName?: string;
  userId?: number;
  userName?: string;
  userFullName?: string;
  customerName: string;
  phoneNumber: string;
  bookingDate: string;
  notes?: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' | string;
  created?: string;
  createdBy?: string;
  lastModified?: string;
  lastModifiedBy?: string;
}

export interface CreateRepairBookingInput {
  repairId: number;
  userId?: number;
  customerName: string;
  phoneNumber: string;
  bookingDate: string;
  notes?: string;
  status?: string;
}
