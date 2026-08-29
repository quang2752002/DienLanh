import { useCrud } from '@/hooks/useCrud';
import { repairBookingApi } from '@/apis/repairBookingApi';
import { RepairBooking, CreateRepairBookingInput } from '@/types/repairBooking';
import { useState, useCallback } from 'react';

export const useRepairBookings = () => {
  const {
    data: bookings,
    loading,
    error,
    refresh,
    create: createBooking,
    update: updateBooking,
    remove: removeBooking,
  } = useCrud<RepairBooking, CreateRepairBookingInput, RepairBooking>(repairBookingApi);

  const [updatingStatus, setUpdatingStatus] = useState(false);

  const updateBookingStatus = useCallback(async (id: number | string, status: string) => {
    try {
      setUpdatingStatus(true);
      const updated = await repairBookingApi.updateStatus(id, status);
      await refresh();
      return updated;
    } catch (e) {
      console.error(e);
      throw e;
    } finally {
      setUpdatingStatus(false);
    }
  }, [refresh]);

  return {
    bookings,
    loading,
    error,
    refresh,
    createBooking,
    updateBooking,
    removeBooking,
    updatingStatus,
    updateBookingStatus,
  };
};
