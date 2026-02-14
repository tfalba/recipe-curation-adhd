import { useRef, useState } from "react";
import { useRecipe } from "../recipe/RecipeContext";
import boilingVideo from "../assets/water-boiling.mp4";

export default function InboxPanel() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [urlMode, setUrlMode] = useState(false);
  const [urlValue, setUrlValue] = useState("");
  const [uploadedName, setUploadedName] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { recipeText, setRecipeText, generateFromText, status, error } =
    useRecipe();

  const API_BASE =
    (import.meta.env.VITE_API_URL as string | undefined) ??
    "http://localhost:10000";

  const stripRtf = (rtf: string) => {
    const decoded = rtf.replace(/\\'[0-9a-fA-F]{2}/g, (match) =>
      String.fromCharCode(parseInt(match.slice(2), 16))
    );
    return decoded
      .replace(/\\par[d]?/g, "\n")
      .replace(/\\[a-zA-Z]+-?\d* ?/g, "")
      .replace(/[{}]/g, "")
      .replace(/\n\s*\n/g, "\n\n")
      .trim();
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleUploadChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    setUploadedName(file.name);
    setUploadError(null);

    const isPdf =
      file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    const isRtf = file.name.toLowerCase().endsWith(".rtf");

    if (isPdf) {
      try {
        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch(`${API_BASE}/api/parse`, {
          method: "POST",
          body: formData,
        });
        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload?.error || "Unable to parse PDF.");
        }
        setRecipeText(typeof payload?.recipeText === "string" ? payload.recipeText : "");
      } catch (err) {
        const message = err instanceof Error ? err.message : "Upload failed.";
        setUploadError(message);
      } finally {
        setUploading(false);
      }
      return;
    }

    try {
      const text = await file.text();
      const parsedText = isRtf ? stripRtf(text) : text;
      setRecipeText(parsedText);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed.";
      setUploadError(message);
    }
  };

  // const handleUrlToggle = () => {
  //   setUrlMode((value) => !value);
  // };

  const handleUrlSubmit = () => {
    if (!urlValue.trim()) {
      return;
    }
    setUploadedName(`URL: ${urlValue.trim()}`);
    setUrlMode(false);
  };

  return (
    <section
      id="inbox"
      className="rounded-3xl border border-border bg-surface p-6 shadow-panel"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted">Inbox</p>
          <h2 className="text-2xl font-display font-semibold">
            Paste a recipe. We build the guide.
          </h2>
          <p className="mt-2 text-sm text-muted">
            We keep steps short, one screen at a time. You can edit anything.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* ADD THIS ABILITY LATER */}
          {/* <button
            onClick={handleUrlToggle}
            className="min-h-[44px] rounded-2xl border border-border bg-surface-2 px-4 text-sm font-semibold text-muted"
          >
            Paste URL
          </button> */}
          <button
            onClick={handleUploadClick}
            className="min-h-[44px] rounded-2xl border border-border bg-surface-2 px-4 text-sm font-semibold text-muted"
          >
            Upload
          </button>
        </div>
      </div>
      {urlMode ? (
        <div className="mt-4 flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-surface-2 p-3">
          <input
            value={urlValue}
            onChange={(event) => setUrlValue(event.target.value)}
            className="min-h-[44px] flex-1 bg-transparent px-3 text-sm text-text focus:outline-none"
            placeholder="Paste a recipe URL..."
          />
          <button
            onClick={handleUrlSubmit}
            className="min-h-[44px] rounded-2xl bg-primary px-4 text-sm font-semibold text-text"
          >
            Use URL
          </button>
        </div>
      ) : null}
      <div className="mt-6 rounded-2xl border border-border bg-surface-2 p-2">
        {status === "loading" ? (
          <div className="flex h-60 items-center justify-center overflow-hidden rounded-xl">
            <video
              className="h-full w-full object-cover"
              src={boilingVideo}
              autoPlay
              loop
              muted
              playsInline
            />
          </div>
        ) : (
          <textarea
            className="h-60 w-full p-2 resize-none bg-transparent text-sm text-text focus:outline-none"
            placeholder="Paste recipe text here..."
            value={recipeText}
            onChange={(event) => setRecipeText(event.target.value)}
          />
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".txt,.pdf,.rtf"
        onChange={handleUploadChange}
      />
      {uploadedName ? (
        <p className="mt-3 text-xs text-muted">Selected: {uploadedName}</p>
      ) : (
        <p className="mt-3 text-xs text-muted">
          You can paste text, drop a URL, or upload a file.
        </p>
      )}
      {uploadError ? <p className="mt-2 text-xs text-danger">{uploadError}</p> : null}
      {error ? <p className="mt-2 text-xs text-danger">{error}</p> : null}
      <button
        onClick={generateFromText}
        disabled={status === "loading" || uploading}
        className="mt-4 w-full min-h-[44px] rounded-2xl bg-accent px-4 text-sm font-semibold text-bg shadow-glow transition duration-quick ease-snappy hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === "loading" || uploading
          ? "Building guide..."
          : "Turn this into a cooking guide"}
      </button>
    </section>
  );
}
