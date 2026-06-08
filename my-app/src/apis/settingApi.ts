import { BaseApiService } from './baseApi';
import { SystemSetting, UpdateSystemSettingInput } from '@/types/setting';

class SettingApiService extends BaseApiService<SystemSetting, any, UpdateSystemSettingInput> {
  constructor() {
    super('/SystemSettings');
  }
}

export const settingApi = new SettingApiService();
