import { useState, useRef, useEffect } from "react";
import { Plus, Clock, User, Paperclip, X } from "lucide-react";
import TextArea from "../../../form/input/TextArea";

interface Note {
  id: string;
  content: string;
  author: string;
  timestamp: Date;
  type: "user" | "system";
  attachment?: string; // Single URL for attachment
}

export default function NoteList() {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: "1",
      content: "Patient checked in successfully. Initial assessment completed.",
      author: "Dr. Smith",
      timestamp: new Date("2024-01-15T09:30:00"),
      type: "user",
      attachment: "https://example.com/attachment1.pdf",
    },
    {
      id: "2",
      content: "Diagnostic tests ordered: Blood work, X-ray chest.",
      author: "Nurse Johnson",
      timestamp: new Date("2024-01-15T10:15:00"),
      type: "user",
    },
    {
      id: "3",
      content: "Task status updated to In Progress",
      author: "System",
      timestamp: new Date("2024-01-15T10:45:00"),
      type: "system",
    },
    {
      id: "4",
      content:
        "Lab results received. All values within normal range. Patient can proceed with scheduled procedure.",
      author: "Lab Tech",
      timestamp: new Date("2024-01-15T14:20:00"),
      type: "user",
      attachment: "https://example.com/attachment2.pdf",
    },
    {
      id: "5",
      content: "Follow-up appointment scheduled for next week.",
      author: "Dr. Smith",
      timestamp: new Date("2024-01-15T16:30:00"),
      type: "user",
    },
  ]);

  const [showAddNote, setShowAddNote] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState("");
  const [newAttachment, setNewAttachment] = useState<File | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new notes are added
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  }, [notes]);

  const handleAddNote = () => {
    if (newNoteContent.trim()) {
      const newNote: Note = {
        id: Date.now().toString(),
        content: newNoteContent.trim(),
        author: "You",
        timestamp: new Date(),
        type: "user",
        attachment: newAttachment
          ? URL.createObjectURL(newAttachment)
          : undefined,
      };
      setNotes((prev) => [...prev, newNote]);
      setNewNoteContent("");
      setNewAttachment(null);
      setShowAddNote(false);
    }
  };

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewAttachment(file);
    }
  };

  const handleRemoveAttachment = () => {
    setNewAttachment(null);
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours === 0) {
      return minutes === 0 ? "Just now" : `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getNoteStyle = (note: Note) => {
    if (note.type === "system") {
      return "bg-gray-50 border-l-4 border-gray-400 text-gray-700";
    }

    // Different subtle colors for different authors
    const authorStyles = {
      "Dr. Smith": "bg-blue-50 border-l-4 border-blue-500",
      "Nurse Johnson": "bg-green-50 border-l-4 border-green-500",
      "Lab Tech": "bg-purple-50 border-l-4 border-purple-500",
      You: "bg-indigo-50 border-l-4 border-indigo-500",
      default: "bg-gray-50 border-l-4 border-gray-500",
    };

    return (
      authorStyles[note.author as keyof typeof authorStyles] ||
      authorStyles.default
    );
  };

  return (
    <div className="h-full flex flex-col bg-white max-w-[450px] border-r border-gray-100">
      {/* Header */}
      <div className="px-4 pb-4 border-b border-gray-100 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Clinical Notes</h2>
            <p className="text-sm text-gray-500 mt-1">
              {notes.length} notes • Updated recently
            </p>
          </div>
          <div className="w-10 h-10 border rounded-lg flex items-center justify-center">
            <User className="w-5 h-5 text-brand-primary" />
          </div>
        </div>
      </div>

      {/* Notes List */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto px-1 py-4 space-y-3 bg-gray-50/30"
      >
        <div className="flex flex-col space-y-4">
          {notes.map((note) => (
            <div
              key={note.id}
              className={`p-3 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md ${getNoteStyle(
                note
              )}`}
            >
              <div className="relative">
                <div className="flex items-start gap-2 justify-between">
                  <div className="text-sm text-gray-800 leading-relaxed mb-1 whitespace-break-spaces">
                    {note.content}
                  </div>
                  {note.attachment && (
                    <div className="flex items-center justify-end">
                      <a
                        href={note.attachment}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 "
                      >
                        <Paperclip className="w-4 h-4 text-gray-500 hover:text-brand-primary transition-colors duration-200" />
                      </a>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100/50">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        note.author === "Dr. Smith"
                          ? "bg-blue-500"
                          : note.author === "Nurse Johnson"
                          ? "bg-green-500"
                          : note.author === "Lab Tech"
                          ? "bg-purple-500"
                          : note.author === "You"
                          ? "bg-indigo-500"
                          : "bg-gray-500"
                      }`}
                    />
                    <span className="font-medium">{note.author}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatTime(note.timestamp)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showAddNote && (
        <div className="p-4 bg-white border-t border-gray-100 shadow-lg">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add New Note
            </label>
            <TextArea
              placeholder="Type your note here... (e.g., Patient observations, test results, follow-up actions)"
              value={newNoteContent}
              onChange={setNewNoteContent}
              rows={3}
              className="bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all duration-200"
            />
            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Attachment
              </label>
              <input
                type="file"
                onChange={handleAttachmentChange}
                className="block w-full text-sm border border-gray-200 rounded-lg text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-l-lg file:border-0 file:text-sm file:font-medium file:bg-brand-primary file:text-white hover:file:bg-brand-primary/90"
              />
              {newAttachment && (
                <div className="mt-2 p-2 bg-white border border-gray-200 rounded-lg flex items-center justify-between">
                  <span className="text-sm text-gray-700 truncate flex-1 mr-2">
                    {newAttachment.name}
                  </span>
                  <button
                    onClick={handleRemoveAttachment}
                    className="p-1 text-gray-500 hover:text-red-500 transition-colors duration-200"
                    title="Remove attachment"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => {
                setShowAddNote(false);
                setNewNoteContent("");
                setNewAttachment(null);
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleAddNote}
              disabled={!newNoteContent.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-brand-primary rounded-lg hover:bg-brand-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Note</span>
            </button>
          </div>
        </div>
      )}

      {!showAddNote && (
        <div className="p-4 bg-white border-t border-gray-100">
          <button
            onClick={() => setShowAddNote(true)}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-white bg-brand-primary rounded-lg hover:bg-brand-primary/90 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Add Clinical Note</span>
          </button>
        </div>
      )}
    </div>
  );
}
