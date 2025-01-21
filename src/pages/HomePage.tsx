import React, { useEffect, useState } from "react";
import ToggleTheme from "@/components/ToggleTheme";
import { useTranslation } from "react-i18next";
import LangToggle from "@/components/LangToggle";
import { Meeting, supabase } from "@/lib/supabase";
import { Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MeetingRoute } from "@/routes/routes";

export default function HomePage() {
  const { t } = useTranslation();
  const { user } = useCurrentUser();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMeetings = async () => {
      const { data, error } = await supabase.from("meeting").select("*");
      setMeetings(data || []);
    };
    fetchMeetings();
  }, []);

  const handleCreateMeeting = async () => {
    const nextNumber = meetings.length + 1;
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

  console.log(meetings);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Meetings</h1>
        <Button onClick={handleCreateMeeting}>Create Meeting</Button>
      </div>
      {/* Show meetings in a card with title and created date, style using shadcn/ui */}
      <div>
        {meetings.map((meeting) => (
          <Card key={meeting.id} className="mb-4">
            <CardHeader>
              <Link
                to="/meeting/$meetingId"
                params={{ meetingId: meeting.id.toString() }}
              >
                <CardTitle>{meeting.title}</CardTitle>
              </Link>
              <CardDescription>{meeting.created_at}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
