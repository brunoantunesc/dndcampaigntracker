import { useEffect, useState } from "react";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
  TimelineOppositeContent,
} from "@mui/lab";
import { CommonButton } from "../ui/Buttons";
import { X } from "lucide-react";
import { Session } from "../../interfaces/Session";
import { compareFictionalDates } from "../../utils/compareFictionalDates";

interface Props {
  sessions: Session[];
  calendarId: string;
}

interface SessionWithDate {
  date: string;
  order: number;
  sessions: Session[];
}

export default function SessionsTimeline({ sessions, calendarId }: Props) {
  const [datedGroups, setDatedGroups] = useState<SessionWithDate[]>([]);
  const [noDateSessions, setNoDateSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setSelectedSession(null);
    }
  };

  if (selectedSession) {
    window.addEventListener("keydown", handleKeyDown);
  }

  return () => {
    window.removeEventListener("keydown", handleKeyDown);
  };
}, [selectedSession]);

  useEffect(() => {
    const groupAndSort = async () => {
      const groups: Record<string, Session[]> = {};
      const noDate: Session[] = [];

      for (const session of sessions) {
        const date = session.inGameDate;
        if (!date) {
          noDate.push(session);
        } else {
          groups[date] ??= [];
          groups[date].push(session);
        }
      }

      const sortable = await Promise.all(
        Object.entries(groups).map(async ([date, sessionList]) => ({
          date,
          order: await compareFictionalDates(date, "__BASE__", calendarId),
          sessions: sessionList,
        }))
      );

      sortable.sort((a, b) => a.order - b.order);
      setDatedGroups(sortable);
      setNoDateSessions(noDate);
    };

    groupAndSort();
  }, [sessions, calendarId]);

  return (
    <>
      {selectedSession && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4"
          onClick={() => setSelectedSession(null)} // fechar ao clicar fora
        >
          <div
            className="bg-gray-900 text-white rounded-xl shadow-lg w-full p-6 relative overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()} // impedir que clique dentro feche a modal
          >
            <div className="absolute top-3 right-3">
              <CommonButton
                onClick={() => setSelectedSession(null)}
                variant="action"
                className="p-1"
                aria-label="Close modal"
                type="button"
              >
                <X color="currentColor" size={20} />
              </CommonButton>
            </div>
            <h2 className="text-2xl font-bold mb-2">{selectedSession.title}</h2>
            <p className="text-sm text-cyan-400 mb-4">
              {selectedSession.inGameDate || "No in-game date"} —{" "}
              {selectedSession.campaign?.name}
            </p>
            <p className="text-base whitespace-pre-wrap">
              {selectedSession.summary || "No summary available."}
            </p>
          </div>
        </div>
      )}

      {noDateSessions.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            maxWidth: 320,
            maxHeight: "80vh",
            overflowY: "auto",
            backgroundColor: "#111",
            border: "1px solid #444",
            borderRadius: 8,
            padding: 16,
            zIndex: 10,
          }}
        >
          <h3 className="text-cyan-300 font-bold mb-2">Sessions without Date</h3>
          {noDateSessions.map((session) => (
            <div
              key={session._id}
              className="bg-gray-800 text-white p-3 rounded mb-2 shadow cursor-pointer"
              onClick={() => setSelectedSession(session)}
            >
              <h5 className="font-semibold">{session.title}</h5>
              <p className="text-sm text-gray-400 line-clamp-3">
                {session.summary || "No summary"}
              </p>
              <p className="text-xs text-cyan-400 mt-1">
                {session.campaign?.name}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="text-center space-y-16">
        <Timeline position="right" className="mx-auto">
          {datedGroups.map(({ date, sessions }, index) => (
            <TimelineItem key={date}>
              <TimelineOppositeContent className="text-gray-400 text-xs pr-2">
                {date}
              </TimelineOppositeContent>

              <TimelineSeparator>
                <TimelineDot className="bg-cyan-500" />
                {index < datedGroups.length - 1 && (
                  <TimelineConnector className="bg-cyan-700" />
                )}
              </TimelineSeparator>

              <TimelineContent>
                <div className="flex flex-wrap gap-4">
                  {sessions.map((session) => (
                    <div
                      key={session._id}
                      className="bg-gray-800 text-white p-4 rounded-xl shadow-lg w-50 cursor-pointer max-w-xs"
                      onClick={() => setSelectedSession(session)}
                    >
                      <h3 className="font-semibold text-lg">{session.title}</h3>
                      <p className="text-sm text-gray-400 mt-1 line-clamp-3 overflow-hidden text-ellipsis">
                        {session.summary || "No summary"}
                      </p>
                      <p className="text-xs text-cyan-400 mt-2 font-mono">
                        {session.campaign?.name}
                      </p>
                    </div>
                  ))}
                </div>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </div>
    </>
  );
}
