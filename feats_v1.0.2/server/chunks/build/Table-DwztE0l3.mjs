import { defineComponent, computed, mergeProps, isVNode, createVNode, resolveDynamicComponent, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrIncludeBooleanAttr, ssrRenderList, ssrInterpolate, ssrRenderAttr, ssrRenderClass, ssrRenderVNode } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Table",
  __ssrInlineRender: true,
  props: {
    data: {},
    columns: {},
    state: {},
    onStateChange: { type: Function },
    onSelect: { type: Function },
    selectedRowId: {},
    multiSelect: { type: Boolean },
    selectedRowIds: {},
    onSelectionChange: { type: Function }
  },
  setup(__props) {
    const props = __props;
    const visibleColumns = computed(() => {
      var _a;
      const visibility = ((_a = props.state) == null ? void 0 : _a.columnVisibility) || {};
      return (props.columns || []).filter((col) => {
        const key = colId(col);
        if (!key) return true;
        return visibility[key] !== false;
      });
    });
    function colId(col) {
      return col.accessorKey || col.key || col.headerLabel || "";
    }
    function getIsSorted(id) {
      var _a;
      const sorting = (_a = props.state) == null ? void 0 : _a.sorting;
      if (!Array.isArray(sorting)) return false;
      const found = sorting.find((s) => s.id === id);
      if (!found) return false;
      return found.desc ? "desc" : "asc";
    }
    function getCellValue(row, col) {
      if (col.accessorKey) return row == null ? void 0 : row[col.accessorKey];
      if (col.key) return row == null ? void 0 : row[col.key];
      return "";
    }
    function cellContent(col, row) {
      if (typeof col.cell === "function") {
        return col.cell({ getValue: () => getCellValue(row, col), row: { original: row } });
      }
      return getCellValue(row, col);
    }
    function rowKey(row, idx) {
      var _a;
      return (_a = row == null ? void 0 : row.id) != null ? _a : idx;
    }
    function rowClass(row, idx) {
      const key = rowKey(row, idx);
      if (props.multiSelect) {
        const isSelected2 = isRowSelected(row);
        return isSelected2 ? "is-selected cursor-pointer" : "hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer";
      }
      const isSelected = props.selectedRowId !== void 0 && key === props.selectedRowId;
      return isSelected ? "is-selected cursor-pointer" : "hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer";
    }
    function isRowSelected(row) {
      if (!props.multiSelect || !props.selectedRowIds) return false;
      const key = rowKey(row, 0);
      return props.selectedRowIds.includes(key);
    }
    const allSelected = computed(() => {
      if (!props.multiSelect || !props.data || props.data.length === 0) return false;
      const currentIds = props.selectedRowIds || [];
      return props.data.every((row) => currentIds.includes(rowKey(row, 0)));
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "w-full overflow-x-auto" }, _attrs))}><table class="min-w-full"><thead><tr class="bg-gray-100 dark:bg-gray-700">`);
      if (__props.multiSelect) {
        _push(`<th class="p-2 text-left w-10"><input type="checkbox"${ssrIncludeBooleanAttr(allSelected.value) ? " checked" : ""} class="cursor-pointer"></th>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--[-->`);
      ssrRenderList(visibleColumns.value, (col) => {
        _push(`<th class="p-2 text-left dark:text-white">`);
        if (col.enableSorting) {
          _push(`<button class="flex items-center space-x-1"><span>${ssrInterpolate(col.headerLabel || colId(col))}</span>`);
          if (getIsSorted(colId(col))) {
            _push(`<span class="ml-1">${ssrInterpolate(getIsSorted(colId(col)) === "asc" ? "\u25B2" : "\u25BC")}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</button>`);
        } else {
          _push(`<span>${ssrInterpolate(col.headerLabel || colId(col))}</span>`);
        }
        _push(`</th>`);
      });
      _push(`<!--]--></tr></thead><tbody>`);
      if (!__props.data || __props.data.length === 0) {
        _push(`<tr><td${ssrRenderAttr("colspan", visibleColumns.value.length + (__props.multiSelect ? 1 : 0))} class="p-3 text-sm text-gray-500"> No rows </td></tr>`);
      } else {
        _push(`<!--[-->`);
        ssrRenderList(__props.data, (row, idx) => {
          _push(`<tr class="${ssrRenderClass(rowClass(row, idx))}">`);
          if (__props.multiSelect) {
            _push(`<td class="p-2"><input type="checkbox"${ssrIncludeBooleanAttr(isRowSelected(row)) ? " checked" : ""} class="cursor-pointer"></td>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<!--[-->`);
          ssrRenderList(visibleColumns.value, (col) => {
            _push(`<td class="p-2">`);
            if (isVNode(cellContent(col, row))) {
              ssrRenderVNode(_push, createVNode(resolveDynamicComponent(cellContent(col, row)), null, null), _parent);
            } else {
              _push(`<span>${ssrInterpolate(cellContent(col, row))}</span>`);
            }
            _push(`</td>`);
          });
          _push(`<!--]--></tr>`);
        });
        _push(`<!--]-->`);
      }
      _push(`</tbody></table></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Table.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main, { __name: "Table" });

export { __nuxt_component_0 as _ };
//# sourceMappingURL=Table-DwztE0l3.mjs.map
