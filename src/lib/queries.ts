import { QueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { Meeting, supabase } from "./supabase";

export const queryClient = new QueryClient();

export const QUERY_KEYS = {
  meetings: "meetings",
  meeting: "meeting",
};

export const useMeetings = () =>
  useQuery({
    queryKey: [QUERY_KEYS.meetings],
    queryFn: async () =>
      supabase.from("meeting").select("*").order("created_at", {
        ascending: false,
      }),
  });

export const useMeeting = (meetingId: number) =>
  useQuery({
    queryKey: [QUERY_KEYS.meeting, meetingId],
    queryFn: async () =>
      supabase.from("meeting").select("*").eq("id", meetingId).single(),
  });

export const useDeleteMeeting = () =>
  useMutation({
    mutationFn: async (meetingId: number) => {
      await supabase.from("meeting").delete().eq("id", meetingId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.meetings] });
    },
  });
