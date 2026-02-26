import { _ as _sfc_main$1, a as __nuxt_component_4 } from './Spinner-DtjF66NT.mjs';
import { _ as __nuxt_component_0, a as __nuxt_component_1 } from './Toast-D32gdD57.mjs';
import { _ as __nuxt_component_0$1 } from './Table-DwztE0l3.mjs';
import { defineComponent, ref, watch, computed, h, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderComponent, ssrIncludeBooleanAttr, ssrInterpolate, ssrRenderList, ssrLooseContain } from 'vue/server-renderer';
import { $ as $fetch } from '../nitro/nitro.mjs';
import { u as useGlobalLoading } from './useGlobalLoading-FpTo0JxB.mjs';
import 'reka-ui';
import '@vueuse/core';
import './server.mjs';
import 'vue-router';
import 'tailwindcss/colors';
import '@iconify/vue';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '@iconify/utils';
import 'consola';
import 'tailwind-variants';
import './index-iO1hbeZi.mjs';
import '@iconify/utils/lib/css/icon';
import 'perfect-debounce';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const allColumns = [
      { key: "id", label: "ID" },
      { key: "date", label: "Date" },
      { key: "description", label: "Description" },
      { key: "distance", label: "Distance" },
      { key: "average", label: "Average" },
      { key: "grade", label: "Grade" },
      { key: "bike", label: "Bike" },
      { key: "reference", label: "Reference" },
      { key: "link", label: "Link" },
      { key: "notes", label: "Notes" }
    ];
    const bikeOptions = ref(["Santos", "Rimonta"]);
    const pageSizeOptions = ref([5, 10, 20]);
    const rows = ref([]);
    const total = ref(0);
    ref(0);
    ref("");
    ref("date");
    ref("desc");
    const selectedRows = ref([]);
    const isEditing = ref(false);
    const showCols = ref(false);
    const form = ref({ id: null, date: "", description: "", distance: null, average: null, grade: null, bike: "Santos", reference: "", link: "", notes: "" });
    const toast = ref("");
    const showConfirm = ref(false);
    const selectUi = {
      base: "border border-[var(--fts-ui-primary)] bg-[var(--fts-ui-bg-input-form)] text-[var(--fts-ui-primary)] rounded-[4px] min-h-[34px] px-2 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--fts-ui-button)] focus-visible:ring-inset"
    };
    const defaultColumnVisibility = allColumns.reduce((acc, col) => {
      acc[col.key] = true;
      return acc;
    }, {});
    let loadTimeout = null;
    async function load(state) {
      var _a, _b;
      const s = state || tableState.value;
      const pageIndex = ((_a = s.pagination) == null ? void 0 : _a.pageIndex) || 0;
      const pageSize = ((_b = s.pagination) == null ? void 0 : _b.pageSize) || 10;
      const filter = s.globalFilter || "";
      const sort2 = s.sorting && s.sorting[0] || null;
      const sortBy2 = (sort2 == null ? void 0 : sort2.id) || "date";
      const sortDir2 = (sort2 == null ? void 0 : sort2.desc) ? "desc" : "asc";
      const params = new URLSearchParams({ page: String(pageIndex), pageSize: String(pageSize), filter, sortBy: sortBy2, sortDir: sortDir2 });
      setLoading(true);
      try {
        const res = await $fetch(`/api/rides?${params.toString()}`);
        rows.value = res.rows || [];
        total.value = res.total || 0;
      } catch (err) {
        toast.value = (err == null ? void 0 : err.message) || "Failed to load rides";
        setTimeout(() => toast.value = "", 3e3);
      } finally {
        setLoading(false);
      }
    }
    function fetchDebounced(state) {
      clearTimeout(loadTimeout);
      loadTimeout = setTimeout(() => load(state), 200);
    }
    const { loading, setLoading } = useGlobalLoading();
    const tableState = ref({ globalFilter: "", sorting: [{ id: "date", desc: true }], pagination: { pageIndex: 0, pageSize: 10 }, columnVisibility: defaultColumnVisibility });
    watch(() => tableState.value.columnVisibility, (v) => {
      return;
    }, { deep: true });
    watch(() => tableState.value.sorting, (v) => {
      return;
    }, { deep: true });
    watch(tableState, (v) => fetchDebounced(v), { deep: true });
    const start = computed(() => {
      var _a, _b;
      return (((_a = tableState.value.pagination) == null ? void 0 : _a.pageIndex) || 0) * (((_b = tableState.value.pagination) == null ? void 0 : _b.pageSize) || 10);
    });
    const end = computed(() => {
      var _a;
      return Math.min(start.value + (((_a = tableState.value.pagination) == null ? void 0 : _a.pageSize) || 10), total.value);
    });
    const tableColumns = computed(() => [
      { accessorKey: "id", headerLabel: "ID", enableSorting: true },
      { accessorKey: "date", headerLabel: "Date", enableSorting: true },
      { accessorKey: "description", headerLabel: "Description", enableSorting: true },
      { accessorKey: "distance", headerLabel: "Distance", enableSorting: true },
      { accessorKey: "average", headerLabel: "Average", enableSorting: true },
      { accessorKey: "grade", headerLabel: "Grade" },
      { accessorKey: "bike", headerLabel: "Bike", enableSorting: true },
      { accessorKey: "reference", headerLabel: "Reference" },
      {
        accessorKey: "link",
        headerLabel: "Link",
        cell: (ctx) => {
          const value = ctx.getValue();
          if (ctx.row.original.reference) return h("a", { href: ctx.row.original.reference, target: "_blank", class: "text-blue-600 hover:underline" }, value || "Link");
          return value || "";
        }
      },
      { accessorKey: "notes", headerLabel: "Notes" }
    ]);
    function onStateChange(updaterOrValue) {
      tableState.value = typeof updaterOrValue === "function" ? updaterOrValue(tableState.value) : updaterOrValue;
    }
    function setPageSize(n) {
      tableState.value.pagination.pageSize = n;
      tableState.value.pagination.pageIndex = 0;
    }
    function handleSelectionChange(ids) {
      selectedRows.value = ids.map((id) => Number(id));
    }
    function handleTableSelect(e, row) {
      if (!e.ctrlKey && !e.metaKey) {
        const rowId = row == null ? void 0 : row.id;
        if (selectedRows.value.includes(rowId)) {
          selectedRows.value = [];
        } else {
          selectedRows.value = [rowId];
        }
      }
    }
    async function confirmDelete() {
      if (selectedRows.value.length === 0) return;
      try {
        await Promise.all(
          selectedRows.value.map(
            (id) => $fetch(`/api/rides?id=${id}`, { method: "DELETE" })
          )
        );
        showConfirm.value = false;
        toast.value = `${selectedRows.value.length} ride${selectedRows.value.length > 1 ? "s" : ""} deleted`;
        setTimeout(() => toast.value = "", 2500);
        selectedRows.value = [];
        load();
      } catch (err) {
        toast.value = "Failed to delete rides";
        setTimeout(() => toast.value = "", 2500);
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_USelect = _sfc_main$1;
      const _component_ConfirmModal = __nuxt_component_0;
      const _component_Toast = __nuxt_component_1;
      const _component_Table = __nuxt_component_0$1;
      const _component_Spinner = __nuxt_component_4;
      _push(`<section${ssrRenderAttrs(_attrs)}><form class="fts p-6 mb-6 border-color rounded"><h1 class="text-3xl font-semibold mb-6">Add a Ride</h1><div class="grid grid-cols-7 gap-4"><div class="col-span-1"><label class="block">Date*</label><input${ssrRenderAttr("value", form.value.date)} type="date" required class="border px-2 py-1 w-full"></div><div class="col-span-2"><label class="block">Description*</label><input${ssrRenderAttr("value", form.value.description)} type="text" required class="border px-2 py-1 w-full"></div><div class="col-span-1"><label class="block">Distance * (km)</label><input${ssrRenderAttr("value", form.value.distance)} type="number" step="0.1" required class="border px-2 py-1 w-full"></div><div class="col-span-1"><label class="block">Average (km/h)</label><input${ssrRenderAttr("value", form.value.average)} type="number" step="0.1" class="border px-2 py-1 w-full"></div><div class="col-span-1"><label class="block">Grade (%)</label><input${ssrRenderAttr("value", form.value.grade)} type="number" step="0.1" class="border px-2 py-1 w-full"></div><div class="col-span-1"><label class="block">Bike*</label>`);
      _push(ssrRenderComponent(_component_USelect, {
        modelValue: form.value.bike,
        "onUpdate:modelValue": ($event) => form.value.bike = $event,
        items: bikeOptions.value,
        ui: selectUi,
        class: "w-full",
        variant: "none"
      }, null, _parent));
      _push(`</div><div class="col-span-2"><label class="block">Reference</label><input${ssrRenderAttr("value", form.value.reference)} type="text" class="border px-2 py-1 w-full"></div><div class="col-span-1"><label class="block">Link</label><input${ssrRenderAttr("value", form.value.link)}${ssrIncludeBooleanAttr(!form.value.reference) ? " disabled" : ""} type="text" class="border px-2 py-1 w-full"></div><div class="col-span-3"><label class="block">Notes</label><input${ssrRenderAttr("value", form.value.notes)} type="text" class="border px-2 py-1 w-full"></div><div class="col-span-1 flex items-end space-x-2"><button type="submit" class="fts px-3 py-1"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""}>${ssrInterpolate(isEditing.value ? "Update" : "Add")}</button><button type="button" class="fts px-3 py-1"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""}>Clear</button></div></div></form>`);
      _push(ssrRenderComponent(_component_ConfirmModal, {
        show: showConfirm.value,
        title: "Delete Ride",
        message: `Are you sure you want to delete ${selectedRows.value.length} ride${selectedRows.value.length > 1 ? "s" : ""}?`,
        onConfirm: confirmDelete,
        onCancel: () => showConfirm.value = false
      }, null, _parent));
      _push(ssrRenderComponent(_component_Toast, { message: toast.value }, null, _parent));
      _push(`<h1 class="text-3xl font-semibold mb-6 mt-10">Completed Rides</h1><div class="flex items-center justify-between mt-4 mb-4"><div class="flex items-center space-x-2"><button class="px-3 py-1 fts disabled:opacity-50"${ssrIncludeBooleanAttr(selectedRows.value.length !== 1 || unref(loading)) ? " disabled" : ""}>Edit</button><button class="px-3 py-1 fts-delete disabled:opacity-50"${ssrIncludeBooleanAttr(selectedRows.value.length === 0 || unref(loading)) ? " disabled" : ""}>Delete ${ssrInterpolate(selectedRows.value.length > 1 ? `(${selectedRows.value.length})` : "")}</button></div><div class="flex items-center space-x-2"><input${ssrRenderAttr("value", tableState.value.globalFilter)} placeholder="Search" class="border px-2 py-1">`);
      _push(ssrRenderComponent(_component_USelect, {
        modelValue: tableState.value.pagination.pageSize,
        "onUpdate:modelValue": [($event) => tableState.value.pagination.pageSize = $event, (value) => setPageSize(value)],
        items: pageSizeOptions.value,
        ui: selectUi,
        class: "w-24",
        variant: "none"
      }, null, _parent));
      _push(`<div class="relative z-20"><button class="border px-2 py-1">Columns \u25BE</button>`);
      if (showCols.value) {
        _push(`<div class="absolute right-0 mt-2 bg-white dark:bg-gray-800 border dark:border-gray-700 p-2 shadow z-30 w-max"><!--[-->`);
        ssrRenderList(allColumns, (c) => {
          _push(`<label class="block dark:text-white"><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(tableState.value.columnVisibility[c.key]) ? ssrLooseContain(tableState.value.columnVisibility[c.key], null) : tableState.value.columnVisibility[c.key]) ? " checked" : ""}> ${ssrInterpolate(c.label)}</label>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div><div class="table-rides bg-white border overflow-x-auto relative">`);
      _push(ssrRenderComponent(_component_Table, {
        data: rows.value,
        columns: tableColumns.value,
        state: tableState.value,
        multiSelect: true,
        selectedRowIds: selectedRows.value,
        onSelectionChange: handleSelectionChange,
        onStateChange,
        onSelect: (e, row) => handleTableSelect(e, row)
      }, null, _parent));
      if (unref(loading)) {
        _push(ssrRenderComponent(_component_Spinner, null, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="flex items-center justify-between mt-3"><div>Showing ${ssrInterpolate(start.value + 1)} - ${ssrInterpolate(end.value)} of ${ssrInterpolate(total.value)}</div><div class="space-x-2"><button${ssrIncludeBooleanAttr((tableState.value.pagination.pageIndex || 0) === 0) ? " disabled" : ""} class="px-2 py-1 border">Prev</button><button${ssrIncludeBooleanAttr(((tableState.value.pagination.pageIndex || 0) + 1) * (tableState.value.pagination.pageSize || 10) >= total.value) ? " disabled" : ""} class="px-2 py-1 border">Next</button></div></div></section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-Cmn7GXq3.mjs.map
