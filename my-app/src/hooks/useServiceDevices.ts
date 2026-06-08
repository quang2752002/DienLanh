import { useCrud } from '@/hooks/useCrud';
import { serviceDeviceApi } from '@/apis/serviceDeviceApi';
import { ServiceDevice, CreateServiceDeviceInput } from '@/types/serviceDevice';

import { useState, useCallback } from 'react';

export const useServiceDevices = () => {
  const {
    data: serviceDevices,
    loading,
    error,
    refresh,
    create: createServiceDevice,
    update: updateServiceDevice,
    remove: removeServiceDevice,
  } = useCrud<ServiceDevice, CreateServiceDeviceInput, CreateServiceDeviceInput>(serviceDeviceApi);

  const [activeDevice, setActiveDevice] = useState<ServiceDevice | null>(null);
  const [loadingActiveDevice, setLoadingActiveDevice] = useState(false);

  const getServiceDeviceById = useCallback(async (id: string) => {
    try {
      setLoadingActiveDevice(true);
      const srv = await serviceDeviceApi.getById(id);
      setActiveDevice(srv);
      return srv;
    } catch (e) {
      console.error(e);
      return null;
    } finally {
      setLoadingActiveDevice(false);
    }
  }, []);

  return {
    serviceDevices,
    loading,
    error,
    refresh,
    createServiceDevice,
    updateServiceDevice,
    removeServiceDevice,
    activeDevice,
    loadingActiveDevice,
    getServiceDeviceById,
  };
};
