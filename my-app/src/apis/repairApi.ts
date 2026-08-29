import { BaseApiService } from '@/apis/baseApi';
import { Repair, CreateRepairInput } from '@/types/repair';

class RepairApiService extends BaseApiService<Repair, CreateRepairInput, Repair> {
  constructor() {
    super('/Repairs');
  }
}

export const repairApi = new RepairApiService();
