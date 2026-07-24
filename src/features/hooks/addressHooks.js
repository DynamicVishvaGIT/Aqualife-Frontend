import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  makeDefaultAddress,
} from "../address/address";

/* ============================
   Get My Addresses
============================ */

export const useAddresses = () => {
  return useQuery({
    queryKey: ["addresses"],
    queryFn: getAddresses,
    staleTime: 1000 * 60 * 5,
  });
};

/* ============================
   Add Address
============================ */

export const useAddAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addAddress,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["addresses"],
      });
    },
  });
};

/* ============================
   Update Address
============================ */

export const useUpdateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAddress,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["addresses"],
      });
    },
  });
};

/* ============================
   Delete Address
============================ */

export const useDeleteAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAddress,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["addresses"],
      });
    },
  });
};

/* ============================
   Make Default Address
============================ */

export const useMakeDefaultAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: makeDefaultAddress,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["addresses"],
      });
    },
  });
};