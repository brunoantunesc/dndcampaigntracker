import { useState, useEffect } from "react";
import { CommonButton } from "../../components/ui/Buttons";
import { authFetch } from "../../utils/authFetch";
import InputField from "../../components/form/InputField";
import FictionalDateSelect from "../../components/form/FictionalDateSelect";

interface Props {
  calendarId: string;
  worldId: string;
  onClose: () => void;
  onCreated?: () => void;
}

export default function ModalCreateEvent({ calendarId, worldId, onClose, onCreated }: Props) {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [inGameDate, setInGameDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Se quiser, pode validar ou resetar inGameDate caso calendarId mude
  useEffect(() => {
    if (!calendarId) setInGameDate("");
  }, [calendarId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await authFetch("/api/events", {
        method: "POST",
        body: JSON.stringify({
          title,
          summary,
          inGameDate,
          world: worldId,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create event");
      }

      setTitle("");
      setSummary("");
      setInGameDate("");
      if (onCreated) onCreated();
      onClose();
    } catch (err: any) {
      setError(err.message || "Error creating event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 text-white rounded-xl shadow-lg w-full max-w-md p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4">Create Event</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Title *"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <InputField
            label="Summary"
            name="summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            type="textarea"
          />

          <FictionalDateSelect
            label="In-Game Date *"
            name="inGameDate"
            value={inGameDate}
            onChange={(val) => setInGameDate(val)}
            calendarId={calendarId}
            disabled={!calendarId}
          />

          {error && <p className="text-red-500">{error}</p>}

          <div className="flex justify-end gap-2">
            <CommonButton
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </CommonButton>
            <CommonButton type="submit" disabled={loading}>
              {loading ? "Saving..." : "Create"}
            </CommonButton>
          </div>
        </form>
      </div>
    </div>
  );
}
