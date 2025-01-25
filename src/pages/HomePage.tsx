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

// const meetings: Meeting[] = [
//   {
//     id: 1,
//     title: "Weekly Team Sync",
//     created_at: new Date().toISOString(),
//     transcript: "Discussion about Q1 goals and project timeline",
//     notes: "Action items: Update roadmap, schedule follow-ups",
//     user_id: "1",
//     description:
//       "Regular team sync to discuss ongoing projects, address any blockers, and align on priorities. We'll review last week's progress, discuss current challenges, and plan upcoming milestones. This meeting is crucial for maintaining team coordination and ensuring everyone is moving in the right direction.",
//   },
//   {
//     id: 2,
//     title: "Product Review",
//     created_at: new Date().toISOString(),
//     transcript: "Feature review and user feedback analysis",
//     notes: "Priority features identified for next sprint",
//     user_id: "1",
//     description:
//       "Comprehensive monthly product review session with key stakeholders to evaluate product performance, analyze user feedback, and make strategic decisions. We'll examine usage metrics, discuss feature requests, and prioritize development efforts for the upcoming month.",
//   },
//   {
//     id: 3,
//     title: "Client Presentation",
//     created_at: new Date().toISOString(),
//     transcript: "Project status update and demo",
//     notes: "Client feedback: positive on UI, concerns about timeline",
//     user_id: "1",
//     description:
//       "Quarterly review meeting with our major client to showcase project progress, demonstrate new features, and gather feedback. This session includes a detailed walkthrough of completed milestones, discussion of upcoming deliverables, and addressing any concerns or questions from the client side.",
//   },
//   {
//     id: 4,
//     title: "Design Workshop",
//     created_at: new Date().toISOString(),
//     transcript: "UX improvements and design system updates",
//     notes: "New component library proposed",
//     user_id: "1",
//     description:
//       "Interactive workshop with the design team to improve user experience and update our design system. We'll review current pain points in the user journey, brainstorm solutions, and work on standardizing our component library. The session will focus on creating a more cohesive and intuitive user interface.",
//   },
//   {
//     id: 5,
//     title: "Tech Planning",
//     created_at: new Date().toISOString(),
//     transcript: "Architecture discussion and tech debt review",
//     notes: "Decision: migrate to new API version by Q3",
//     user_id: "1",
//     description:
//       "Strategic technical planning session with the engineering team to discuss system architecture, review technical debt, and plan future improvements. We'll evaluate current performance bottlenecks, discuss potential solutions, and create a roadmap for implementing necessary upgrades and migrations.",
//   },
//   {
//     id: 6,
//     title: "Tech Planning",
//     created_at: new Date().toISOString(),
//     transcript: "Architecture discussion and tech debt review",
//     notes: "Decision: migrate to new API version by Q3",
//     user_id: "1",
//     description:
//       "In-depth technical discussion focusing on scalability challenges and infrastructure optimization. The team will review current system bottlenecks, discuss potential architectural improvements, and develop a concrete plan for implementing performance enhancements across our technology stack.",
//   },
//   {
//     id: 7,
//     title: "Tech Planning",
//     created_at: new Date().toISOString(),
//     transcript: "Architecture discussion and tech debt review",
//     notes: "Decision: migrate to new API version by Q3",
//     user_id: "1",
//     description:
//       "Comprehensive technical planning meeting to address long-term architectural vision and sustainability. We'll evaluate emerging technologies, discuss potential adoption strategies, and create a detailed implementation plan for modernizing our technical infrastructure while maintaining system stability.",
//   },
// ];

export default function HomePage() {
  const { t } = useTranslation();
  const { user, loading } = useCurrentUser();
  const navigate = useNavigate();
  const { data: meetings, isLoading: meetingsLoading } = useMeetings();

  const handleCreateMeeting = async () => {
    const nextNumber = meetings?.data?.length || 0 + 1;
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

  return !user && !loading ? (
    <Navigate to="/signup" />
  ) : (
    <div className="flex h-full flex-col">
      <div className="h-40 w-full bg-slate-200" />
      <hr className="w-full" />
      <div className="flex flex-1 flex-col items-center overflow-auto p-4">
        <div className="mx-auto flex w-full max-w-[500px] flex-col gap-2">
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
        <Button className="mt-4" onClick={handleCreateMeeting}>
          Create New Meeting
        </Button>
      </div>
    </div>
  );
}
