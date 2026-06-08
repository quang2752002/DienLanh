import { useCrud } from '@/hooks/useCrud';
import { tipApi } from '@/apis/tipApi';
import { Tip, CreateTipInput } from '@/types/tip';
import { useState, useCallback } from 'react';

export const useTips = () => {
  const {
    data: tips,
    loading,
    error,
    refresh,
    create: createTip,
    update: updateTip,
    remove: removeTip,
  } = useCrud<Tip, CreateTipInput, Tip>(tipApi);

  const [activeTip, setActiveTip] = useState<Tip | null>(null);
  const [loadingActiveTip, setLoadingActiveTip] = useState(false);

  const getTipById = useCallback(async (id: string) => {
    try {
      setLoadingActiveTip(true);
      const tip = await tipApi.getById(id);
      setActiveTip(tip);
      return tip;
    } catch (e) {
      console.error(e);
      return null;
    } finally {
      setLoadingActiveTip(false);
    }
  }, []);

  return {
    tips,
    loading,
    error,
    refresh,
    createTip,
    updateTip,
    removeTip,
    activeTip,
    loadingActiveTip,
    getTipById,
  };
};
