import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Download, Mic, Square } from "lucide-react";

const messages = [
  "The funny thing is I didn't unfollow Elon at all. ",
  "One of the headlines was that Marques and Elon unfollowed each other on Twitter. I woke up to find that my account had unfollowed. What? What I assume happened was you know, how you can, like, block and unblock sort of soft unfollow so they don't know that they unfollow you? Does that force them to unfollow you? Yeah. If you block someone, they can't follow you anymore. ",
  "So if you, like, block them and unblock them, they'll stop seeing your stuff. Wait. So are art did he block you? So I was following you. He tweets a ton, and I I don't really have any, like, political follows. I follow people who I wanna their stuff, and I don't follow people who I don't wanna see their stuff. Elon is tweeting a lot. I don't know if you noticed. It's I did. It was getting closer. I was like, do I mute him? I still wanna see, like, the important stuff, but there's just too much stuff now. When I saw that, I was like, wait. Yeah. I just realized I haven't seen any El Ensemble. ",
  "Summer Time Line in, like, a couple of days. So I assume he, like, did something, either block and unblocked or, like, funny thing is I didn't unfollow Elon at all. One of the headlines It that Marques and Elon unfollowed each other on Twitter. I woke up to find that ",
];

export default function TranscriptPopover() {
  const [isRecording, setIsRecording] = useState(false);

  const handleRecord = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsRecording(!isRecording);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleRecord}
            variant={isRecording ? "destructive" : undefined}
            size="icon"
            // className={isRecording ? "text-red-500" : ""}
          >
            {isRecording ? (
              <Square className="h-4 w-4" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </Button>
          <Button variant="outline">Transcript</Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="flex h-[500px] w-[450px] flex-col overflow-hidden p-0">
        <div className="flex items-center justify-between p-2 px-4">
          <span className="text-lg font-bold">Transcript</span>
          <Button variant="outline">
            <Download />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="grid gap-4 p-2 px-4 pt-1">
            <div className="flex flex-col gap-2">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className="rounded-lg bg-gray-100 px-4 py-2 text-sm text-black"
                >
                  {message}
                </div>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
