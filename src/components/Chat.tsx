import * as React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

import { Check, Loader2, Plus, Send } from "lucide-react";
import { Input } from "./ui/input";

import { cn } from "@/lib/utils";
import { ChatItem, Meeting, supabase } from "@/lib/supabase";
import { useCallback, useEffect, useState } from "react";
import { QUERY_KEYS } from "@/lib/queries";
import { queryClient } from "@/lib/queries";
import { sendTextPrompt } from "@/lib/server";

interface ChatProps {
  chatHistory: ChatItem[];
  meeting?: Meeting | null;
}

export function Chat({ chatHistory, meeting }: ChatProps) {
  const [input, setInput] = React.useState("");
  const inputLength = input.trim().length;
  const [chat, setChat] = useState<ChatItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (chat.length === 0) {
      setChat(chatHistory);
    }
    scrollToBottom();
  }, [chatHistory, chat]);

  const updateChatHistory = useCallback(
    async (newChat: ChatItem[]) =>
      await supabase
        .from("meeting")
        .update({
          chat_history: JSON.stringify(newChat),
        })
        .eq("id", meeting?.id || 0)
        .select(),
    [meeting?.id],
  );

  const handleSend = async () => {
    if (!meeting) return;
    const newChat: ChatItem[] = [...chat, { actor: "user", content: input }];
    setChat(newChat);
    setIsLoading(true);

    updateChatHistory(newChat).then((res) => {
      console.log("updated chat history with user", res);
    });

    sendTextPrompt({
      meeting: meeting,
      type: "chat",
      note: "",
      chatQuestion: input,
    }).then((res) => {
      console.log("AI response", res);

      setChat((chat) => {
        const newChat: ChatItem[] = [
          ...chat,
          { actor: "agent", content: res.data.response },
        ];
        updateChatHistory(newChat).then((res) => {
          console.log("updated chat history with agent", res);
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.meeting, meeting.id],
        });
        return newChat;
      });
      setIsLoading(false);
    });
  };

  return (
    <>
      <Card className="flex h-full flex-col rounded-none border-none">
        <CardHeader className="flex flex-row items-center p-3">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src="/avatars/01.png" alt="Image" />
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium leading-none">Meeting AI</p>
              <p className="text-sm text-muted-foreground">
                Personal assistant
              </p>
            </div>
          </div>
          {/* <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="outline"
                  className="ml-auto rounded-full"
                  onClick={() => setOpen(true)}
                >
                  <Plus />
                  <span className="sr-only">New message</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent sideOffset={10}>New message</TooltipContent>
            </Tooltip>
          </TooltipProvider> */}
        </CardHeader>
        <CardContent
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto border-t pt-3"
        >
          <div className="space-y-4">
            {chat.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                  message.actor === "user"
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "bg-muted",
                )}
              >
                {message.content}
              </div>
            ))}
            {isLoading ? (
              <div
                className={cn(
                  "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",

                  "bg-muted",
                )}
              >
                Typing...
              </div>
            ) : null}
          </div>
        </CardContent>
        <CardFooter>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (inputLength === 0) return;
              handleSend();
              setInput("");
            }}
            className="flex w-full items-center space-x-2"
          >
            <Input
              id="message"
              placeholder="Type your message..."
              className="flex-1"
              autoComplete="off"
              value={input}
              onChange={(event) => setInput(event.target.value)}
            />
            <Button type="submit" size="icon" disabled={inputLength === 0}>
              <Send />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
      {/* <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="gap-0 p-0 outline-none">
          <DialogHeader className="px-4 pb-4 pt-5">
            <DialogTitle>New message</DialogTitle>
            <DialogDescription>
              Invite a user to this thread. This will create a new group
              message.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex items-center border-t p-4 sm:justify-between">
            {selectedUsers.length > 0 ? (
              <div className="flex -space-x-2 overflow-hidden">
                {selectedUsers.map((user) => (
                  <Avatar
                    key={user.email}
                    className="inline-block border-2 border-background"
                  >
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Select users to add to this thread.
              </p>
            )}
            <Button
              disabled={selectedUsers.length < 2}
              onClick={() => {
                setOpen(false);
              }}
            >
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
    </>
  );
}
