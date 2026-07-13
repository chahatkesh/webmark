import React, { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Bookmark,
  Check,
  FolderOpen,
  Loader2,
  MoreVertical,
  Search,
  Sparkles,
} from "lucide-react";

const favicon = (domain) =>
  `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

const initialCategoryBookmarks = [
  { id: "netflix", name: "Netflix", domain: "netflix.com" },
  { id: "spotify", name: "Spotify", domain: "spotify.com" },
  { id: "notion", name: "Notion", domain: "notion.so" },
  { id: "layr", name: "uselayr.com", domain: "uselayr.com" },
  { id: "figma", name: "Figma", domain: "figma.com" },
  { id: "chatgpt", name: "ChatGPT", domain: "chat.openai.com" },
];

const searchBookmarks = [
  { id: "figma", name: "Figma design notes", domain: "figma.com" },
  { id: "webmark", name: "Webmark UX notes", domain: "notion.so" },
  { id: "systems", name: "Design systems guide", domain: "designsystems.com" },
];

const getBookmarkFromUrl = (value) => {
  try {
    const normalized = /^https?:\/\//i.test(value.trim())
      ? value.trim()
      : `https://${value.trim()}`;
    const parsed = new URL(normalized);
    const domain = parsed.hostname.replace(/^www\./, "");
    const label = domain.split(".")[0];

    return {
      domain,
      name: label.charAt(0).toUpperCase() + label.slice(1),
    };
  } catch {
    return null;
  }
};

const BookmarkRow = ({ name, domain, delay = 0, active = false, onClick }) => {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.8 }}
      transition={{ duration: 0.35, delay }}
      whileHover={onClick && !reduceMotion ? { x: 2 } : undefined}
      onClick={onClick}
      className={`flex min-w-0 items-center gap-2 rounded-lg px-2.5 py-2 transition-colors ${
        active ? "bg-blue-50 ring-1 ring-blue-100" : "bg-white/90"
      } ${onClick ? "cursor-pointer" : ""}`}
    >
      <img
        src={favicon(domain)}
        alt=""
        className="h-4 w-4 shrink-0 rounded-sm"
        loading="lazy"
      />
      <span className="min-w-0 flex-1 truncate text-[11px] font-medium text-gray-700 sm:text-xs">
        {name}
      </span>
      <MoreVertical className="h-3.5 w-3.5 shrink-0 text-gray-300" />
    </motion.div>
  );
};

const SortableBookmarkRow = ({ item }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.55 : 1,
        zIndex: isDragging ? 10 : "auto",
      }}
      {...attributes}
      {...listeners}
      className="touch-none cursor-grab active:cursor-grabbing"
    >
      <BookmarkRow name={item.name} domain={item.domain} />
    </div>
  );
};

const CategoryPreview = () => {
  const [bookmarks, setBookmarks] = useState(initialCategoryBookmarks);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;

    setBookmarks((current) => {
      const oldIndex = current.findIndex((item) => item.id === active.id);
      const newIndex = current.findIndex((item) => item.id === over.id);
      return arrayMove(current, oldIndex, newIndex);
    });
  };

  return (
    <div className="relative h-full min-h-[232px] overflow-hidden rounded-2xl bg-blue-50/55 p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base">⚡</span>
          <span className="text-sm font-semibold text-blue-700">
            Productivity
          </span>
        </div>
        <span className="text-[10px] font-medium text-blue-500">
          Drag any item
        </span>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={bookmarks.map((item) => item.id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {bookmarks.map((item) => (
              <SortableBookmarkRow key={item.id} item={item} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

const SavePreview = () => {
  const reduceMotion = useReducedMotion();
  const [url, setUrl] = useState("github.com/chahatkesh/webmark");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(false);
  const [savedBookmark, setSavedBookmark] = useState({
    name: "GitHub",
    domain: "github.com",
  });

  const handleSave = (event) => {
    event.preventDefault();
    const bookmark = getBookmarkFromUrl(url);

    if (!bookmark) {
      setError(true);
      setSaved(false);
      return;
    }

    setSavedBookmark(bookmark);
    setError(false);
    setSaved(true);
  };

  return (
    <div className="relative min-h-[205px] overflow-hidden rounded-2xl bg-violet-50/45 p-4 sm:p-5">
      <div className="rounded-xl bg-white/90 p-3.5 shadow-[0_8px_24px_rgba(76,29,149,0.06)]">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100">
            <Bookmark className="h-3.5 w-3.5 text-violet-500" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-800">Save bookmark</p>
            <p className="text-[9px] text-gray-400">
              Title and icon found automatically
            </p>
          </div>
        </div>
        <form onSubmit={handleSave} className="mb-2.5 flex items-center gap-2">
          <input
            value={url}
            onChange={(event) => {
              setUrl(event.target.value);
              setSaved(false);
              setError(false);
            }}
            aria-label="Try a bookmark URL"
            aria-invalid={error}
            className={`min-w-0 flex-1 rounded-md border bg-white px-2.5 py-2 text-[10px] text-gray-600 outline-none transition focus:ring-2 ${
              error
                ? "border-red-300 focus:ring-red-100"
                : "border-gray-200 focus:border-violet-300 focus:ring-violet-100"
            }`}
          />
          <button
            type="submit"
            disabled={!url.trim()}
            className="rounded-md bg-violet-500 px-2.5 py-2 text-[9px] font-semibold text-white transition hover:bg-violet-600 active:scale-95"
          >
            Save
          </button>
        </form>
        <div className="flex items-center justify-between rounded-md bg-gray-50 px-2.5 py-2">
          <div className="flex items-center gap-2">
            <img
              src={favicon(savedBookmark.domain)}
              alt=""
              className="h-4 w-4 rounded-sm"
            />
            <span className="text-[10px] font-medium text-gray-700">
              {savedBookmark.name} · {savedBookmark.domain}
            </span>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            {saved ? (
              <motion.span
                key="saved"
                initial={reduceMotion ? false : { scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100"
              >
                <Check className="h-3 w-3 text-emerald-600" />
              </motion.span>
            ) : (
              <span
                className={`text-[8px] font-medium ${
                  error ? "text-red-500" : "text-gray-400"
                }`}
              >
                {error ? "Invalid URL" : "Ready"}
              </span>
            )}
          </AnimatePresence>
        </div>
      </div>
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-medium text-violet-500">
        Save from the dashboard or bookmarklet
      </div>
    </div>
  );
};

const SearchPreview = () => {
  const [query, setQuery] = useState("design");
  const results = searchBookmarks.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="min-h-[205px] overflow-hidden rounded-2xl bg-sky-50/45 p-4 sm:p-5">
      <label className="mb-3 flex items-center gap-2 rounded-lg bg-white/90 px-3 py-2.5 shadow-[0_8px_24px_rgba(14,116,144,0.06)]">
        <Search className="h-3.5 w-3.5 text-sky-500" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Try bookmark search"
          placeholder="Search bookmarks"
          className="min-w-0 flex-1 bg-transparent text-[10px] text-gray-600 outline-none"
        />
        <span className="rounded border border-gray-100 px-1.5 py-0.5 text-[8px] text-gray-400">
          ⌘K
        </span>
      </label>
      <div className="space-y-2">
        <AnimatePresence initial={false}>
          {results.map((item, index) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, delay: index * 0.03 }}
            >
              <BookmarkRow name={item.name} domain={item.domain} />
            </motion.div>
          ))}
        </AnimatePresence>
        {results.length === 0 && (
          <p className="py-8 text-center text-[10px] text-gray-400">
            No matching bookmarks
          </p>
        )}
      </div>
    </div>
  );
};

const SortPreview = () => {
  const reduceMotion = useReducedMotion();
  const [sorted, setSorted] = useState(false);
  const [sorting, setSorting] = useState(false);

  const handleSort = () => {
    if (sorted) {
      setSorted(false);
      return;
    }
    setSorting(true);
    window.setTimeout(() => {
      setSorting(false);
      setSorted(true);
    }, 650);
  };

  return (
    <div className="relative min-h-[240px] overflow-hidden rounded-2xl bg-amber-50/45 p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100">
            <Sparkles className="h-3.5 w-3.5 text-amber-600" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-800">AI Sort</p>
            <p className="text-[9px] text-gray-400">
              Bookmarks find their place
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleSort}
          disabled={sorting}
          className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1.5 text-[9px] font-semibold text-amber-600 shadow-sm transition hover:text-amber-700 active:scale-95 disabled:opacity-60"
        >
          {sorting && <Loader2 className="h-3 w-3 animate-spin" />}
          {sorting ? "Sorting" : sorted ? "Undo sort" : "Run AI Sort"}
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-gray-100 bg-white/70 p-2.5">
          <div className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold text-gray-600">
            <FolderOpen className="h-3 w-3 text-gray-400" /> Uncategorized
          </div>
          <AnimatePresence mode="popLayout">
            {!sorted && (
              <motion.div
                key="uncategorized-claude"
                initial={false}
                animate={{
                  opacity: sorting ? 0.3 : 1,
                  y: sorting && !reduceMotion ? 5 : 0,
                }}
                exit={{ opacity: 0, scale: 0.92 }}
              >
                <BookmarkRow name="Claude" domain="claude.ai" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="rounded-lg border border-amber-100 bg-white/90 p-2.5">
          <div className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold text-amber-700">
            <span>🤖</span> AI Tools
          </div>
          <BookmarkRow name="ChatGPT" domain="chatgpt.com" delay={0.08} />
          <div className="mt-2">
            <BookmarkRow
              name="Perplexity"
              domain="perplexity.ai"
              delay={0.16}
            />
          </div>
          <AnimatePresence>
            {sorted && (
              <motion.div
                key="sorted-claude"
                initial={reduceMotion ? false : { opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                className="mt-2"
              >
                <BookmarkRow name="Claude" domain="claude.ai" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const BentoCard = ({ title, description, children, className = "" }) => (
  <motion.article
    whileHover={{ y: -2 }}
    transition={{ duration: 0.18 }}
    className={`flex min-w-0 flex-col overflow-hidden rounded-[24px] border border-gray-100 bg-gray-50/45 p-3.5 shadow-[0_10px_35px_rgba(15,23,42,0.035)] sm:p-4 ${className}`}
  >
    <div className="mb-4 px-1 pt-1">
      <h3 className="text-lg font-semibold leading-tight text-gray-900">
        {title}
      </h3>
      <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-gray-500">
        {description}
      </p>
    </div>
    <div className="mt-auto">{children}</div>
  </motion.article>
);

const HowToUse = () => (
  <section id="how-to-use" className="bg-white py-14 md:py-20">
    <div className="mx-auto max-w-[72rem] px-4 sm:px-6">
      <div className="mx-auto mb-9 max-w-[44rem] text-center md:mb-12">
        <h2 className="text-[1.875rem] font-bold leading-tight tracking-[-0.037em] text-[#111827] md:text-[2.25rem]">
          A calmer way to organise the web
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-12 lg:auto-rows-[minmax(250px,auto)]">
        <BentoCard
          title="A dashboard shaped around you"
          description="Build your space your way, then drag everything into place."
          className="lg:col-span-7 lg:row-span-1"
        >
          <CategoryPreview />
        </BentoCard>

        <BentoCard
          title="Save a page without the admin"
          description="Save any page in one click. We handle the details."
          className="lg:col-span-5"
        >
          <SavePreview />
        </BentoCard>

        <BentoCard
          title="Search the details you remember"
          description="Search what you remember and find it instantly."
          className="lg:col-span-5"
        >
          <SearchPreview />
        </BentoCard>

        <BentoCard
          title="Let AI handle the cleanup"
          description="Turn bookmark clutter into useful categories in one click."
          className="lg:col-span-7"
        >
          <SortPreview />
        </BentoCard>
      </div>
    </div>
  </section>
);

export default HowToUse;
