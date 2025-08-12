import { useRef, useState } from "react";

interface FileUploaderProps {
  onParsed: (messages: any[]) => void;
}

export function FileUploader({ onParsed }: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const parseNow = async () => {
    if (!file) return;
    setError(null);
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      // Slack export for a channel is usually an array of messages in the file
      const messages = Array.isArray(json) ? json : json.messages ?? [];
      onParsed(messages);
    } catch (e: any) {
      setError("Failed to parse JSON. Please upload a valid messages.json");
    }
  };

  const loadSample = async () => {
    setError(null);
    try {
      const res = await fetch("/samples/messages_incident.json", {
        cache: "no-store",
      });
      const json = await res.json();
      const messages = Array.isArray(json) ? json : json.messages ?? [];
      onParsed(messages);
      setFileName("messages_incident.json");
    } catch (e) {
      setError("Failed to load sample data");
    }
  };

  const onDrop: React.DragEventHandler<HTMLDivElement> = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) {
      setFile(dropped);
      setFileName(dropped.name);
    }
  };

  return (
    <div className="bg-white rounded-lg border p-4">
      <h2 className="text-base font-semibold mb-2">
        Upload Slack messages.json
      </h2>
      <div
        className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-gray-50"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDrop={onDrop}
      >
        <p className="text-sm text-gray-600">Click to choose file</p>
        <p className="text-xs text-gray-400">or drag and drop here</p>
        {fileName && (
          <p className="mt-1 text-xs text-gray-500">Selected: {fileName}</p>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".json,application/json"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            setFile(file);
            setFileName(file.name);
          }
        }}
      />
      <div className="flex items-center gap-2">
        <button
          className="mt-3 inline-flex items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          onClick={parseNow}
          disabled={!file}
        >
          Generate Timeline
        </button>
        <button
          className="mt-2 inline-flex items-center justify-center rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200"
          onClick={loadSample}
        >
          Load Sample Data
        </button>
        <button
          className="mt-2 inline-flex items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ring-1 ring-gray-200"
          onClick={() => {
            setFile(null);
            setFileName("");
            setError(null);
            onParsed([]);
          }}
        >
          Clear
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
