import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SessionsTimeline from "../../components/interactive/SessionsTimeline";
import { Session } from "../../interfaces/Session";
import { authFetch } from "../../utils/authFetch";
import Loading from "../../components/ui/Loading";
import ErrorMessage from "../../components/ui/ErrorMessage";
import Header from "../../components/ui/Header";
import ModalCreateEvent from "../../components/form/ModalCreateEvent";
import { CommonButton } from "../../components/ui/Buttons";
import { Event } from "../../interfaces/Event";

export default function SessionsPage() {
  const { id } = useParams();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [calendarId, setCalendarId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);  
  const [createEventOpen, setCreateEventOpen] = useState(false);

  const worldId = id;

  const fetchSessionsAndEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const resSessions = await authFetch("/api/sessions");
      const dataSessions: Session[] = await resSessions.json();
      const filteredSessions = dataSessions.filter(s => s.campaign?.world?._id === id);
      setSessions(filteredSessions);

      const resEvents = await authFetch("/api/events");
      const dataEvents: Event[] = await resEvents.json();
      // Filtrar eventos do mundo
      const filteredEvents = dataEvents.filter(e => e.world._id === id);
      setEvents(filteredEvents);

      if (filteredSessions.length > 0) {
        const firstCalendarId = filteredSessions[0]?.campaign?.world?.calendar._id;
        if (firstCalendarId) {
          setCalendarId(firstCalendarId);
        } else {
          setError("No calendar ID found in the first session.");
        }
      } else if (filteredEvents.length === 0) {
        setError("No sessions or events found for this world.");
      } else {
        // Temos eventos, mas sem sessões
        setError(null);
        // calendarId não muda se não achou sessions?
        // Se quiser tentar obter calendarId de outro lugar, implemente aqui
      }
    } catch (err) {
      setError("Failed to load sessions or events.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchSessionsAndEvents();
    } else {
      setError("Missing world ID.");
      setLoading(false);
    }
  }, [id]);

  const handleCreateEventClick = () => {
    setCreateEventOpen(true);
  };

  if (loading) return <Loading />;
  if (error || !calendarId) return <ErrorMessage message={error || "Unknown error"} />;

  return (
    <>
      <Header />
      <div className="p-6 relative">
        <h1 className="text-3xl font-bold text-cyan-400 mb-6">World Timeline</h1>
        <div className="relative mb-4">
          <CommonButton
            variant="mini"
            onClick={handleCreateEventClick}
            className="rounded-t-none rounded-b px-3 py-2 text-left"
            type="button"
          >
            Add event
          </CommonButton>
        </div>

        <SessionsTimeline
          sessions={sessions}
          events={events}
          calendarId={calendarId}
          onDeleteEventSuccess={fetchSessionsAndEvents}
        />

        {createEventOpen && calendarId && worldId && (
          <ModalCreateEvent
            calendarId={calendarId}
            worldId={worldId}
            onClose={() => setCreateEventOpen(false)}
            onCreated={() => {
              fetchSessionsAndEvents();
              setCreateEventOpen(false);
            }}
          />
        )}
      </div>
    </>
  );
}
