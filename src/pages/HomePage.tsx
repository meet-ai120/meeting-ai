import React, { useEffect, useState } from "react";
import ToggleTheme from "@/components/ToggleTheme";
import { useTranslation } from "react-i18next";
import LangToggle from "@/components/LangToggle";
import { Meeting, supabase } from "@/lib/supabase";
import { Link, Navigate, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { MeetingRoute } from "@/routes/routes";
import { MeetingItem } from "@/components/MeetingItem";
import { useMeetings } from "@/lib/queries";
import { MeetingItemsSkeleton } from "@/components/Skeleton";

export default function HomePage() {
  const { t } = useTranslation();
  const { user, loading } = useCurrentUser();
  const navigate = useNavigate();
  const { data: meetings, isLoading: meetingsLoading } = useMeetings();

  const handleCreateMeeting = async () => {
    const nextNumber = (meetings?.data?.length || 0) + 1;
    const { data, error } = await supabase
      .from("meeting")
      .insert([{ title: `Meeting #${nextNumber}` }])
      .select()
      .single();

    if (data) {
      navigate({
        to: "/meeting/$meetingId",
        params: { meetingId: data.id.toString() },
      });
    }
  };

  return loading ? (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-gray-900 dark:border-white" />
    </div>
  ) : !user ? (
    <Navigate to="/signup" />
  ) : (
    <div className="flex h-full flex-col">
      {/* <div className="h-40 w-full bg-slate-200" /> */}
      <hr className="w-full" />
      <div className="flex flex-1 flex-col items-center overflow-auto p-4">
        <div className="mx-auto flex w-full max-w-[500px] flex-col gap-2">
          <Button className="mb-2 h-12" onClick={handleCreateMeeting}>
            Create New Meeting
          </Button>
          {meetingsLoading ? (
            <>
              <MeetingItemsSkeleton />
              <MeetingItemsSkeleton />
              <MeetingItemsSkeleton />
            </>
          ) : (
            meetings?.data?.map((meeting) => (
              <MeetingItem key={meeting.id} meeting={meeting} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
