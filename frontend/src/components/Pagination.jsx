export default function Pagination({ meta, page, canGoPrev, setPage, canGoNext }) {
  let from = null;
  let to = null;
  let total = null;

  if (meta) {
    total = meta.total;
    from = (meta.current_page - 1) * meta.per_page + 1;
    to = Math.min(meta.current_page * meta.per_page, meta.total);
  }

  return (
    <div className="flex items-center justify-between border-t border-zinc-200 px-4 py-3">
      <div className="text-xs text-zinc-600">
        {meta ? (
          <>
            Showing <span className="font-medium text-zinc-800">{from}</span>–{" "}
            <span className="font-medium text-zinc-800">{to}</span> of{" "}
            <span className="font-medium text-zinc-800">{total}</span> • Page{" "}
            <span className="font-medium text-zinc-800">{meta.current_page}</span> of{" "}
            <span className="font-medium text-zinc-800">{meta.last_page}</span>
          </>
        ) : (
          <>Page {page}</>
        )}
      </div>

      <div className="flex gap-2">
        <button
          disabled={!canGoPrev}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="rounded-md border border-zinc-300 px-3 py-1.5 text-xs text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
        >
          Prev
        </button>

        <button
          disabled={!canGoNext}
          onClick={() => setPage((p) => p + 1)}
          className="rounded-md border border-zinc-300 px-3 py-1.5 text-xs text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
