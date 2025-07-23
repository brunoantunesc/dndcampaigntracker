import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SessionsTimeline from "../../components/interactive/SessionsTimeline";
import { Session } from "../../interfaces/Session";
import { authFetch } from "../../utils/authFetch";
import Loading from "../../components/ui/Loading";
import ErrorMessage from "../../components/ui/ErrorMessage";
import Header from "../../components/ui/Header";

export default function SessionsPage() {
  const { id } = useParams();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [calendarId, setCalendarId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await authFetch("/api/sessions");
        const data: Session[] = await res.json();

        const filtered = data.filter(
          (s) => s.campaign?.world?._id === id
        );

        setSessions(filtered);

        if (filtered.length > 0) {
          const firstCalendarId = filtered[0]?.campaign?.world?.calendar._id;
          if (firstCalendarId) {
            setCalendarId(firstCalendarId);
          } else {
            setError("No calendar ID found in the first session.");
          }
        } else {
          setError("No sessions found for this world.");
        }
      } catch (err) {
        setError("Failed to load sessions.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSessions();
    } else {
      setError("Missing world ID.");
      setLoading(false);
    }
  }, [id]);

  if (loading) return <Loading />;
  if (error || !calendarId) return <ErrorMessage message={error || "Unknown error"} />;

  return (
    <>
    <Header />
    <div className="p-6 relative">
      <h1 className="text-3xl font-bold text-cyan-400 mb-6">World Timeline</h1>
      <SessionsTimeline sessions={sessions} calendarId={calendarId} />
    </div>
    </>
  );
}
