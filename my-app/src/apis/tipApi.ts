import { BaseApiService } from './baseApi';
import { Tip, CreateTipInput } from '@/types/tip';

class TipApiService extends BaseApiService<Tip, CreateTipInput, Tip> {
  constructor() {
    super('/Tips');
  }
}

export const tipApi = new TipApiService();
