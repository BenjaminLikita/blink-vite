import { useMutation, useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "./query_keys";
import axios from "./axios";


interface Meeting {
  id: string;
  createdAt: string;
  name: string
  userId: string
  type: 'public' | 'private'
}

export const useGetMeetingsQuery = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_MEETINGS],
    queryFn: async () => {
      const response = await axios.get('/calls')
      return response.data as Meeting[]
    }
  })
}

export const useGetMeetingQuery = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_MEETINGS, id],
    queryFn: async () => {
      const response = await axios.get('/call/' + id)
      return response.data as Meeting
    }
  })
}

export const useCreateMeetingMutation = () => {
  return useMutation({
    mutationKey: [QUERY_KEYS.GET_MEETINGS],
    mutationFn: async (body: object) => {
      const response = await axios.post('/call/create', body)
      return response.data as Meeting
    }
  })
}