import { useCrud } from '@/hooks/useCrud';
import { settingApi } from '@/apis/settingApi';
import { SystemSetting, UpdateSystemSettingInput } from '@/types/setting';

export const useSettings = () => {
  const {
    data: settings,
    loading,
    error,
    refresh,
    update: updateSetting,
  } = useCrud<SystemSetting, any, UpdateSystemSettingInput>(settingApi);

  return {
    settings,
    loading,
    error,
    refresh,
    updateSetting,
  };
};
