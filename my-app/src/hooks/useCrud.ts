import { useState, useEffect, useCallback } from 'react';
import { BaseApiService } from '../apis/baseApi';

export function useCrud<T, TCreate = any, TUpdate = any>(
  apiService: BaseApiService<T, TCreate, TUpdate>,
  immediate = true
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(immediate);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiService.getAll();
      setData(result);
    } catch (err: any) {
      setError(err?.message || 'Không thể tải danh sách dữ liệu.');
    } finally {
      setLoading(false);
    }
  }, [apiService]);

  const create = useCallback(async (input: TCreate) => {
    try {
      setError(null);
      const newItem = await apiService.create(input);
      setData((prev) => [...prev, newItem]);
      return newItem;
    } catch (err: any) {
      const errMsg = err?.details || err?.message || 'Không thể thêm dữ liệu mới.';
      setError(errMsg);
      throw new Error(errMsg);
    }
  }, [apiService]);

  const update = useCallback(async (id: string, input: TUpdate) => {
    try {
      setError(null);
      const updatedItem = await apiService.update(id, input);
      setData((prev) => prev.map((item: any) => ((item as any).id === id ? updatedItem : item)));
      return updatedItem;
    } catch (err: any) {
      const errMsg = err?.details || err?.message || 'Không thể cập nhật dữ liệu.';
      setError(errMsg);
      throw new Error(errMsg);
    }
  }, [apiService]);

  const remove = useCallback(async (id: string) => {
    try {
      setError(null);
      await apiService.delete(id);
      setData((prev) => prev.filter((item: any) => (item as any).id !== id));
    } catch (err: any) {
      const errMsg = err?.details || err?.message || 'Không thể xóa dữ liệu.';
      setError(errMsg);
      throw new Error(errMsg);
    }
  }, [apiService]);

  useEffect(() => {
    if (immediate) {
      fetchAll();
    }
  }, [fetchAll, immediate]);

  return {
    data,
    loading,
    error,
    refresh: fetchAll,
    create,
    update,
    remove,
  };
}
