import { BaseApiService } from './baseApi';
import { ServiceDevice, CreateServiceDeviceInput } from '../types/serviceDevice';

class ServiceDeviceApiService extends BaseApiService<ServiceDevice, CreateServiceDeviceInput, CreateServiceDeviceInput> {
  constructor() {
    super('/ServiceDevices');
  }
}

export const serviceDeviceApi = new ServiceDeviceApiService();
