"use client";
import { useState, useRef, useEffect } from "react";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";
import {
  Send,
  User,
  Image as ImageIcon,
  FileText,
  Download,
  ArrowLeft,
  RefreshCcw,
} from "lucide-react";
import { showToast } from "@/lib/toast";
import Link from "next/link";
import { AxiosError } from "axios";
import { mockTickets } from "@/app/(admin)/(others-pages)/support-tickets/mock-data";
import Loading from "@/components/Loading";
import { Avatar, AvatarFallback } from "@/components/ui/avatar/modernAvatar";
import TextArea from "@/components/form/input/TextArea";
import { FileUploadComponent } from "@/components/form/input/file-upload";

interface ChatMessage {
  id: string;
  message: string;
  sender: "user" | "agent" | "bot";
  timestamp: string;
  attachments?: any[];
  senderName?: string;
  isRead?: boolean;
}

export function ConversationView() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      message: `Hi! I've created this ticket regarding "${mockTickets[0]?.subject}". I need assistance with this issue.`,
      sender: "user",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      senderName: "You",
      isRead: true,
    },
    {
      id: "2",
      message:
        "Thank you for contacting us! I've received your ticket and I'm reviewing the details. I'll help you resolve this issue as quickly as possible.",
      sender: "agent",
      timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
      senderName: "Sarah (Support)",
      isRead: true,
    },
    {
      id: "3",
      message:
        "I've looked into your account and I can see the issue you're experiencing. Let me walk you through the solution step by step.",
      sender: "agent",
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      senderName: "Sarah (Support)",
      isRead: false,
    },
  ]);

  const [newMessage, setNewMessage] = useState("");
  const [, setAttachments] = useState<any[]>([]);
  const uploadRef = useRef<{ clearFiles: () => void }>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  const [ticket, ] = useState<any>(mockTickets[0]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // function base64ToFile(base64: string, filename: string): File {
  //   const arr = base64.split(",");
  //   const mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg";
  //   const bstr = atob(arr[1]);
  //   let n = bstr.length;
  //   const u8arr = new Uint8Array(n);
  //   while (n--) {
  //     u8arr[n] = bstr.charCodeAt(n);
  //   }
  //   return new File([u8arr], filename, { type: mime });
  // }

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    setLoading(true);
    try {
      const payload: any = new FormData();
      
      payload.append("message", newMessage);
      //   const res = await axios.post(
      //     `support-tickets/${ticket?._id}/comments`,
      //     payload,
      //     {
      //       headers: {
      //         "Content-Type": "multipart/form-data",
      //       },
      //       adminURL: true,
      //     }
      //   );
      //   const response = res?.data?.Response?.comment;
      //   showToast("success", res?.data?.title, res?.data?.message);
      //   setTicket((p: any) => ({
      //     ...p,
      //     comments: [
      //       ...p.comments,
      //       {
      //         ...response,
      //         authorInfo: {
      //           _id: loggedInUserDetails?.tenantUser?._id,
      //         },
      //       },
      //     ],
      //   }));
      const newMsg: ChatMessage = {
        id: Date.now().toString(),
        message: newMessage,
        sender: "user",
        timestamp: new Date().toISOString(),
        senderName: "You",
        isRead: true,
      };
      setMessages((prev) => [...prev, newMsg]);
      setNewMessage("");
      setAttachments([]);
      uploadRef.current?.clearFiles();
    } catch (error: unknown) {
      const axiosError = error as AxiosError<any>;
      const errData = axiosError?.response?.data;
      showToast(
        "error",
        errData?.title || "Error",
        errData?.message || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "primary";
      case "in-progress":
        return "warning";
      case "resolved":
        return "success";
      case "closed":
        return "fog";
      case "Open":
        return "primary";
      case "In Progress":
        return "warning";
      case "Resolved":
        return "success";
      case "Closed":
        return "fog";
      default:
        return "dusk";
    }
  };

  const [refreshing, setRefreshing] = useState(false);
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      //   const res = await fetchSupportTicketDetail(
      //     { id: ticket?._id },
      //     { adminURL: true }
      //   );
      //   setTicket(res);
    } catch (error: unknown) {
      const axiosError = error as AxiosError<any>;
      const errData = axiosError?.response?.data;
      showToast(
        "error",
        errData?.title || "Error",
        errData?.message || "An error occurred. Please try again."
      );
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="h-full flex flex-col text-gray-600 dark:text-white/70 p-4 lg:p-6 bg-white dark:bg-white/[0.03] rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <Link href={"/support"}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-lg text-gray-800 dark:text-white/90">
                {ticket?.subject || ticket?.title}
              </h1>
              <Badge variant="light" color="light">
                #{ticket?._id || ticket?.id}
              </Badge>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Badge
                variant="light"
                color={getStatusColor(ticket?.status || "")}>
                {ticket?.status ? ticket.status.replace("-", " ") : ""}
              </Badge>
              <Badge variant="light" color={"light"}>
                {ticket?.categoryInfo?.name || ticket?.category}
              </Badge>
            </div>
          </div>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleRefresh()}
          disabled={refreshing}
          className="min-w-[115px]">
          {refreshing ? (
            <Loading size={1} />
          ) : (
            <>
              <RefreshCcw className="h-4 w-4 mr-1" />
              Refresh
            </>
          )}
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-800">
        <div className="p-4 space-y-4">
          {refreshing ? (
            <div className="h-[300px] w-full flex items-center justify-center">
              <Loading />
            </div>
          ) : (
            <>
              {messages.length > 0 ? (
                messages.map((message) => {
                  const sender = message.sender;
                  const isUserMessage = sender === "user";
                  return (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${
                        isUserMessage ? "flex-row-reverse" : ""
                      }`}>
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarFallback
                          className={`text-xs ${
                            isUserMessage
                              ? "bg-primary text-foreground"
                              : "bg-blue-500 text-white"
                          }`}>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>

                      <div
                        className={`flex-1 max-w-[75%] ${
                          isUserMessage ? "text-right" : ""
                        }`}>
                        <div
                          className={`flex items-center gap-2 mb-1 text-xs ${
                            isUserMessage ? "justify-end" : ""
                          }`}>
                          <span className="font-medium">
                            {message.senderName}
                          </span>
                          <span>{formatTime(message.timestamp)}</span>
                        </div>

                        <div
                          className={`shadow-sm border-none w-max max-w-full ${
                            isUserMessage
                              ? "bg-brand-500 text-white ml-auto rounded-l-2xl rounded-b-2xl"
                              : "bg-white dark:bg-gray-700 rounded-r-2xl rounded-b-2xl"
                          }`}>
                          <div className="p-3 sm:p-3">
                            <p className="text-sm whitespace-pre-wrap leading-relaxed">
                              {message.message}
                            </p>

                            {message.attachments &&
                              message.attachments.length > 0 && (
                                <div className="mt-3 space-y-2">
                                  {message.attachments.map(
                                    (attachment: any, idx: number) => (
                                      <div
                                        key={idx}
                                        className={`flex items-center gap-2 p-2 rounded border ${
                                          isUserMessage
                                            ? "bg-primary-foreground/10 border-primary-foreground/20"
                                            : "bg-muted border-border"
                                        }`}>
                                        {attachment.fileName?.match(
                                          /\.(jpg|jpeg|png|gif|webp)$/i
                                        ) ? (
                                          <ImageIcon className="h-4 w-4" />
                                        ) : (
                                          <FileText className="h-4 w-4" />
                                        )}
                                        <span className="text-xs flex-1 truncate">
                                          {attachment?.fileName || "Attachment"}
                                        </span>
                                        <button
                                          onClick={async () => {
                                            const res = await fetch(
                                              attachment.fileUrl
                                            );
                                            const blob = await res.blob();
                                            const url =
                                              window.URL.createObjectURL(blob);

                                            const link =
                                              document.createElement("a");
                                            link.href = url;
                                            link.download =
                                              attachment.fileName || "download";
                                            document.body.appendChild(link);
                                            link.click();
                                            document.body.removeChild(link);

                                            window.URL.revokeObjectURL(url);
                                          }}
                                          className="h-6 w-6 p-0 hover:bg-white hover:text-primary flex items-center justify-center rounded">
                                          <Download className="h-3 w-3" />
                                        </button>
                                      </div>
                                    )
                                  )}
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  No messages yet. Start the conversation!
                </div>
              )}
            </>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {ticket?.status !== "Resolved" && (
        <div className="border-t border-gray-300 dark:border-gray-600 pt-6">
          <div className="space-y-3">
            <TextArea
              value={newMessage}
              onChange={(value) => setNewMessage(value)}
              placeholder="Type your message..."
              rows={3}
              className="resize-none"
              onKeyDown={(e: any) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />

            <div className="flex items-center justify-between">
              <FileUploadComponent
                ref={uploadRef}
                onFilesChange={setAttachments}
                maxFiles={3}
                maxSizeMB={5}
              />

              <Button
                onClick={sendMessage}
                disabled={!newMessage.trim() || loading}
                className="gap-2 min-w-[165px]">
                {loading ? (
                  <Loading size={1} style={2} />
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Message
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
