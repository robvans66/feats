import { _ as __nuxt_component_0, a as __nuxt_component_1 } from './Toast-D32gdD57.mjs';
import { defineComponent, ref, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderList, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrRenderComponent } from 'vue/server-renderer';
import { $ as $fetch } from '../nitro/nitro.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "configuration",
  __ssrInlineRender: true,
  setup(__props) {
    const backingUp = ref(false);
    const bikeOptions = ref([]);
    const surfaceOptions = ref([]);
    const pageSizeOptions = ref([]);
    const ridesColumnVisibility = ref({});
    const routesColumnVisibility = ref({});
    const newBikeOption = ref("");
    const newSurfaceOption = ref("");
    const newPageSizeOption = ref("");
    const saving = ref(false);
    const toast = ref("");
    const showResetConfirm = ref(false);
    const ridesColumns = [
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
    const routesColumns = [
      { key: "id", label: "ID" },
      { key: "description", label: "Description" },
      { key: "distance", label: "Distance" },
      { key: "start", label: "Start" },
      { key: "destination", label: "Destination" },
      { key: "grade", label: "Grade" },
      { key: "surface", label: "Surface" },
      { key: "reference", label: "Reference" },
      { key: "link", label: "Link" },
      { key: "notes", label: "Notes" }
    ];
    function initVisibility(columns, existing) {
      const result = {};
      for (const col of columns) {
        result[col.key] = true;
      }
      return result;
    }
    function getDefaults() {
      return {
        bikeOptions: ["Santos", "Rimonta", "Gazelle", "Wahoo"],
        surfaceOptions: ["Road", "Gravel", "Road/Gravel", "Gravel/MTB"],
        pageSizeOptions: [5, 10, 20],
        ridesColumnVisibility: initVisibility(ridesColumns),
        routesColumnVisibility: initVisibility(routesColumns)
      };
    }
    function broadcastConfig(config) {
      return;
    }
    async function saveConfig() {
      saving.value = true;
      const payload = {
        bikeOptions: bikeOptions.value,
        surfaceOptions: surfaceOptions.value,
        pageSizeOptions: pageSizeOptions.value,
        ridesColumnVisibility: ridesColumnVisibility.value,
        routesColumnVisibility: routesColumnVisibility.value
      };
      try {
        await $fetch("/api/config", {
          method: "PUT",
          body: payload
        });
        broadcastConfig(payload);
        showToast("Configuration saved.");
      } catch {
        showToast("Failed to save configuration.");
      } finally {
        saving.value = false;
      }
    }
    function confirmReset() {
      showResetConfirm.value = false;
      const defaults = getDefaults();
      bikeOptions.value = [...defaults.bikeOptions];
      surfaceOptions.value = [...defaults.surfaceOptions];
      pageSizeOptions.value = [...defaults.pageSizeOptions];
      ridesColumnVisibility.value = { ...defaults.ridesColumnVisibility };
      routesColumnVisibility.value = { ...defaults.routesColumnVisibility };
      saveConfig();
    }
    function showToast(message) {
      toast.value = message;
      setTimeout(() => {
        toast.value = "";
      }, 2500);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ConfirmModal = __nuxt_component_0;
      const _component_Toast = __nuxt_component_1;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "fts" }, _attrs))}><h1 class="text-2xl pt-8 font-semibold ml-7 mb-4">Configuration</h1><div class="fts p-4 mt-3 mb-6 border-color rounded"><div class="grid gap-4 lg:grid-cols-3"><div class="fts-cfg-options"><label class="block">Bike Options</label><div class="flex items-center gap-2 mt-1"><input${ssrRenderAttr("value", newBikeOption.value)} type="text" class="border px-2 py-1 w-full" placeholder="Add bike"><button class="fts px-3 py-1" type="button">Add</button></div><div class="flex flex-wrap gap-2 mt-2"><!--[-->`);
      ssrRenderList(bikeOptions.value, (option, index) => {
        _push(`<span class="fts-option-item inline-flex items-center gap-2 px-2 py-1 border rounded"><span>${ssrInterpolate(option)}</span><button class="text-xs" type="button">x</button></span>`);
      });
      _push(`<!--]--></div></div><div class="fts-cfg-options"><label class="block">Surface Options</label><div class="flex items-center gap-2 mt-1"><input${ssrRenderAttr("value", newSurfaceOption.value)} type="text" class="border px-2 py-1 w-full" placeholder="Add surface"><button class="fts px-3 py-1" type="button">Add</button></div><div class="flex flex-wrap gap-2 mt-2"><!--[-->`);
      ssrRenderList(surfaceOptions.value, (option, index) => {
        _push(`<span class="fts-option-item inline-flex items-center gap-2 px-2 py-1 border rounded"><span>${ssrInterpolate(option)}</span><button class="text-xs" type="button">x</button></span>`);
      });
      _push(`<!--]--></div></div><div class="fts-cfg-options"><label class="block">Page Size Options</label><div class="flex items-center gap-2 mt-1"><input${ssrRenderAttr("value", newPageSizeOption.value)} type="number" min="1" step="1" class="border px-2 py-1 w-full" placeholder="Add size"><button class="fts px-3 py-1" type="button">Add</button></div><div class="flex flex-wrap gap-2 mt-2"><!--[-->`);
      ssrRenderList(pageSizeOptions.value, (option, index) => {
        _push(`<span class="fts-option-item inline-flex items-center gap-2 px-2 py-1 border rounded"><span>${ssrInterpolate(option)}</span><button class="text-xs" type="button">x</button></span>`);
      });
      _push(`<!--]--></div></div></div><div class="grid gap-4 mt-8 lg:grid-cols-2"><div class="fts-cfg-options"><label class="block">Rides Columns</label><div class="grid gap-2 mt-2 sm:grid-cols-2 p-3 rounded"><!--[-->`);
      ssrRenderList(ridesColumns, (col) => {
        _push(`<label class="flex items-center gap-2"><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(ridesColumnVisibility.value[col.key]) ? ssrLooseContain(ridesColumnVisibility.value[col.key], null) : ridesColumnVisibility.value[col.key]) ? " checked" : ""}><span>${ssrInterpolate(col.label)}</span></label>`);
      });
      _push(`<!--]--></div></div><div class="fts-cfg-options"><label class="block">Routes Columns</label><div class="grid gap-2 mt-2 sm:grid-cols-2"><!--[-->`);
      ssrRenderList(routesColumns, (col) => {
        _push(`<label class="flex items-center gap-2"><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(routesColumnVisibility.value[col.key]) ? ssrLooseContain(routesColumnVisibility.value[col.key], null) : routesColumnVisibility.value[col.key]) ? " checked" : ""}><span>${ssrInterpolate(col.label)}</span></label>`);
      });
      _push(`<!--]--></div></div></div><div class="fts-cfg-options-buttons flex justify-end gap-3 mt-6"><button class="fts px-3 py-1"${ssrIncludeBooleanAttr(saving.value) ? " disabled" : ""}>Save Configuration</button><button class="fts-cfg-reset-button border px-3 py-1" type="button"${ssrIncludeBooleanAttr(saving.value) ? " disabled" : ""}>Reset to Defaults</button></div></div><div class="fts-cfg-options flex gap-3 mt-6"><button class="fts px-3 py-1"${ssrIncludeBooleanAttr(saving.value || backingUp.value) ? " disabled" : ""}>Backup Data</button><span class="px-3 py-1">Make a backup of your data. This will download a SQL file containing all your rides, routes, and configuration.</span></div>`);
      _push(ssrRenderComponent(_component_ConfirmModal, {
        show: showResetConfirm.value,
        title: "Reset Configuration",
        message: "Are you sure you want to reset configuration to defaults?",
        onConfirm: confirmReset,
        onCancel: ($event) => showResetConfirm.value = false
      }, null, _parent));
      _push(ssrRenderComponent(_component_Toast, { message: toast.value }, null, _parent));
      _push(`</section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/configuration.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=configuration-fV7p7OhP.mjs.map
