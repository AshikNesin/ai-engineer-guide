// Click-to-sort for <table> headers with <button class="sort" data-key="...">.
// getValue(row, key) returns a number or string; nulls always sort last.
export function makeSortable(table, getValue, onSort = () => {}) {
  const tbody = table.tBodies[0];
  let state = { key: null, dir: 1 };
  function sortBy(key, dir) {
    state = { key, dir };
    table.querySelectorAll("th").forEach((th) => th.removeAttribute("aria-sort"));
    const th = table.querySelector(`button.sort[data-key="${key}"]`)?.closest("th");
    if (th) th.setAttribute("aria-sort", dir === 1 ? "ascending" : "descending");
    const rows = [...tbody.rows];
    rows.sort((a, b) => {
      const pa = a.classList.contains("is-pinned") ? 0 : 1;
      const pb = b.classList.contains("is-pinned") ? 0 : 1;
      if (pa !== pb) return pa - pb;
      const va = getValue(a, key);
      const vb = getValue(b, key);
      if (va == null && vb == null) return 0;
      if (va == null) return 1;
      if (vb == null) return -1;
      return (typeof va === "string" ? va.localeCompare(vb) : va - vb) * dir;
    });
    rows.forEach((r) => tbody.appendChild(r));
    onSort(state);
  }
  table.querySelectorAll("button.sort").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.key;
      sortBy(key, state.key === key ? -state.dir : 1);
    });
  });
  return { sortBy, resort: () => state.key && sortBy(state.key, state.dir), get state() { return state; } };
}
