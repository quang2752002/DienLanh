import { BaseApiService } from '@/apis/baseApi';
import api from '@/lib/axios';
import { RepairBooking, CreateRepairBookingInput } from '@/types/repairBooking';

class RepairBookingApiService extends BaseApiService<RepairBooking, CreateRepairBookingInput, RepairBooking> {
  constructor() {
    super('/RepairBookings');
  }

  async getMyBookings(): Promise<RepairBooking[]> {
    const response = await api.get('/RepairBookings/my-bookings');
    return response.data;
  }

  async updateStatus(id: number | string, status: string): Promise<RepairBooking> {
    const response = await api.patch(`/RepairBookings/${id}/status`, JSON.stringify(status), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  }
}

export const repairBookingApi = new RepairBookingApiService();
