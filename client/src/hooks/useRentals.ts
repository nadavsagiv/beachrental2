import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Rental, RentalType, PaymentMethod, CreateRentalDto, UpdateRentalDto } from '../shared/types';
import api from '../utils/api';

export function useRentals() {
  const queryClient = useQueryClient();

  // Fetch all rentals
  const { data: rentals = [], isLoading } = useQuery<Rental[]>({
    queryKey: ['rentals'],
    queryFn: async () => {
      const { data } = await api.get('/rentals');
      return data;
    },
    refetchInterval: 5000, // Refetch every 5 seconds
  });

  // Create a new rental
  const createRental = useMutation({
    mutationFn: async (data: CreateRentalDto) => {
      const response = await api.post('/rentals', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rentals'] });
    },
  });

  // Update rental
  const updateRental = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateRentalDto }) => {
      const response = await api.patch(`/rentals/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rentals'] });
    },
  });

  // End rental
  const endRental = useMutation({
    mutationFn: async (id: number) => {
      const response = await api.post(`/rentals/${id}/end`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rentals'] });
    },
  });

  // Get active rentals by type
  const getActiveRentalsByType = (type: RentalType) => {
    return rentals.filter(rental => rental.type === type && !rental.endTime);
  };

  return {
    rentals,
    isLoading,
    createRental,
    endRental,
    updateRental,
    getActiveRentalsByType,
  };
} 