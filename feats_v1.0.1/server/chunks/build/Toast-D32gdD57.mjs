import { defineComponent, mergeProps, toRefs, computed, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate } from 'vue/server-renderer';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "ConfirmModal",
  __ssrInlineRender: true,
  props: { show: Boolean, title: String, message: String },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.show) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "fixed inset-0 bg-black/40 flex items-center justify-center z-50" }, _attrs))}><div class="bg-white dark:bg-gray-800 p-4 rounded shadow max-w-md w-full"><h3 class="font-semibold mb-2 dark:text-white">${ssrInterpolate(__props.title)}</h3><p class="mb-4 dark:text-gray-300">${ssrInterpolate(__props.message)}</p><div class="flex justify-end space-x-2"><button class="px-3 py-1 border dark:border-gray-600 dark:text-white">Cancel</button><button class="px-3 py-1 bg-red-600 text-white">Confirm</button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ConfirmModal.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main$1, { __name: "ConfirmModal" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Toast",
  __ssrInlineRender: true,
  props: {
    message: {}
  },
  setup(__props) {
    const props = __props;
    const { message } = toRefs(props);
    const msg = computed(() => message.value);
    return (_ctx, _push, _parent, _attrs) => {
      if (msg.value) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "fixed fts-toast bottom-6 right-6 text-white px-4 py-2 rounded shadow z-50" }, _attrs))}>${ssrInterpolate(msg.value)}</div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Toast.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main, { __name: "Toast" });

export { __nuxt_component_0 as _, __nuxt_component_1 as a };
//# sourceMappingURL=Toast-D32gdD57.mjs.map
