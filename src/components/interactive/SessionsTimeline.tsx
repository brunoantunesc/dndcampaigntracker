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
import { X, Trash } from "lucide-react";
import { Session } from "../../interfaces/Session";
import { Event } from "../../interfaces/Event"; // importe seu tipo de evento
import { getOrderForDate } from "../../utils/compareFictionalDates";
import { authFetch } from "../../utils/authFetch";

interface Props {
  sessions: Session[];
  events: Event[];
  calendarId: string;
  onDeleteEventSuccess?: () => void;
}

interface Item {
  id: string;
  title: string;
  summary?: string;
  inGameDate?: string;
  type: "session" | "event";
  campaignName?: string;
}

interface GroupedByDate {
  date: string;
  order: number;
  items: Item[];
}

export default function SessionsTimeline({ sessions, events, calendarId, onDeleteEventSuccess }: Props) {
  const [grouped, setGrouped] = useState<GroupedByDate[]>([]);
  const [noDateItems, setNoDateItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedItem(null);
      }
    };

    if (selectedItem) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedItem]);

  const handleDelete = async () => {
    if (!selectedItem || selectedItem.type !== "event") {
      alert("Somente eventos podem ser deletados");
      return;
    }

    try {
      const response = await authFetch(`/api/events/${selectedItem.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        alert(`Erro ao deletar evento: ${data.message || response.statusText}`);
      } else {
        alert("Evento deletado com sucesso!");
        setSelectedItem(null);
        if (onDeleteEventSuccess) {
          onDeleteEventSuccess();
        }
      }
    } catch (err: any) {
      alert("Erro ao deletar evento: " + err.message);
    }
  };

  useEffect(() => {
    const groupAndSort = async () => {
      const groups: Record<string, Item[]> = {};
      const noDate: Item[] = [];

      const mapSessionToItem = (s: Session): Item => ({
        id: s._id,
        title: s.title,
        summary: s.summary,
        inGameDate: s.inGameDate,
        type: "session",
        campaignName: s.campaign?.name,
      });

      const mapEventToItem = (e: Event): Item => ({
        id: e._id,
        title: e.title,
        summary: e.summary,
        inGameDate: e.inGameDate,
        type: "event",
      });

      const allItems = [
        ...sessions.map(mapSessionToItem),
        ...events.map(mapEventToItem),
      ];

      for (const item of allItems) {
        if (!item.inGameDate) {
          noDate.push(item);
        } else {
          groups[item.inGameDate] ??= [];
          groups[item.inGameDate].push(item);
        }
      }

      const sortable = await Promise.all(
        Object.entries(groups).map(async ([date, items]) => ({
          date,
          order: await getOrderForDate(date, calendarId),
          items,
        }))
      );
      console.log(sortable)

      sortable.sort((a, b) => a.order - b.order);

      setGrouped(sortable);
      setNoDateItems(noDate);
    };

    groupAndSort();
  }, [sessions, events, calendarId]);

  return (
    <>
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div className={`rounded-xl shadow-lg w-full p-6 relative overflow-y-auto max-h-[90vh] ${
            selectedItem.type === "event" ? "bg-orange-100 text-black" : "bg-gray-900 text-white"
          }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-3 right-3">
              <CommonButton
                onClick={handleDelete}
                variant="actionDanger"
                className="p-1"
                aria-label="Delete event"
                type="button"
              >
                <Trash color="currentColor" size={20} />
              </CommonButton>

              <CommonButton
                onClick={() => setSelectedItem(null)}
                variant="action"
                className="p-1"
                aria-label="Close modal"
                type="button"
              >
                <X color="currentColor" size={20} />
              </CommonButton>
            </div>
            <h2 className="text-2xl font-bold mb-2">{selectedItem.title}</h2>
            <p className={`mb-4 text-sm ${
              selectedItem.type === "session" ? "text-cyan-400" : "text-black"
            }`}>
              {selectedItem.inGameDate || "No in-game date"} —{" "}
              {selectedItem.type === "session" ? selectedItem.campaignName : "Canon event"}
            </p>
            <p className="text-base whitespace-pre-wrap">
              {selectedItem.summary || "No summary available."}
            </p>
          </div>
        </div>
      )}

      {noDateItems.length > 0 && (
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
          <h3 className="text-cyan-300 font-bold mb-2">Items without Date</h3>
          {noDateItems.map((item) => (
            <div
              key={item.id}
              className={`p-3 rounded mb-2 shadow cursor-pointer ${
                item.type === "event" ? "bg-orange-200 text-black" : "bg-gray-800 text-white"
              }`}
              onClick={() => setSelectedItem(item)}
            >
              <h5 className="font-semibold">{item.title}</h5>
              <p className="text-sm line-clamp-3">
                {item.summary || "No summary"}
              </p>
              <p className="text-xs mt-1 font-mono text-cyan-400">
                {item.type === "session" ? item.campaignName : "Canon event"}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="text-center space-y-16">
        <Timeline position="right" className="mx-auto">
          {grouped.map(({ date, items }, index) => (
            <TimelineItem key={date}>
              <TimelineOppositeContent className="text-gray-400 text-xs pr-2">
                {date}
              </TimelineOppositeContent>

              <TimelineSeparator>
                <TimelineDot
                  className={items.some(i => i.type === "event") ? "bg-orange-300" : "bg-cyan-500"}
                />
                {index < grouped.length - 1 && (
                  <TimelineConnector className="bg-cyan-700" />
                )}
              </TimelineSeparator>

              <TimelineContent>
                <div className="flex flex-wrap gap-2">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className={`p-4 rounded-xl shadow-lg w-40 cursor-pointer max-w-xs ${
                        item.type === "event"
                          ? "bg-orange-100 text-black"
                          : "bg-gray-800 text-white"
                      }`}
                      onClick={() => setSelectedItem(item)}
                    >
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                      <p className="text-sm mt-1 line-clamp-3 overflow-hidden text-ellipsis">
                        {item.summary || "No summary"}
                      </p>
                      <p className={`mt-1 text-sm ${
                        item.type === "session" ? "text-cyan-400" : "text-black"
                      }`}>
                        {item.type === "session" ? item.campaignName : "Canon event"}
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
