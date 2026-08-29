import { BaseApiService } from '@/apis/baseApi';
import api from '@/lib/axios';
import { Repair, CreateRepairInput } from '@/types/repair';

class RepairApiService extends BaseApiService<Repair, CreateRepairInput, Repair> {
  constructor() {
    super('/Repairs');
  }

  getBySlug = async (slug: string): Promise<Repair> => {
    const response = await api.get<Repair>(`${this.endpoint}/slug/${slug}`);
    return response.data;
  };
}

export const repairApi = new RepairApiService();
