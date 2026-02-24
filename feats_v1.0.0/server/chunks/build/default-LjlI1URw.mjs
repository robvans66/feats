import { _ as __nuxt_component_0$1 } from './nuxt-link-D5MgHvpW.mjs';
import { _ as _sfc_main$4, u as useGlobalLoading } from './useGlobalLoading-FpTo0JxB.mjs';
import { mergeProps, withCtx, renderSlot, defineComponent, ref, createTextVNode, unref, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSlot } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';
import '../nitro/nitro.mjs';
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
import './index-iO1hbeZi.mjs';
import '@iconify/vue';
import '@iconify/utils/lib/css/icon';
import 'perfect-debounce';
import 'reka-ui';
import '@vueuse/core';
import 'vue-router';
import 'tailwindcss/colors';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';

const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "UHeader",
  __ssrInlineRender: true,
  setup(__props) {
    const { loading } = useGlobalLoading();
    const isDark = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      const _component_UIcon = _sfc_main$4;
      _push(`<header${ssrRenderAttrs(mergeProps({ class: "fts shadow" }, _attrs))}><div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between"><div class="flex items-center space-x-3">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "fts-brandname text-5xl font-semibold text-white hover:text-white"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`feats`);
          } else {
            return [
              createTextVNode("feats")
            ];
          }
        }),
        _: 1
      }, _parent));
      if (unref(loading)) {
        _push(`<div class="text-sm text-white/80 flex items-center">Loading <span class="ml-2 animate-spin">\u27F3</span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><nav class="flex items-center space-x-4">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "text-xl text-white/90 hover:text-white"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Rides`);
          } else {
            return [
              createTextVNode("Rides")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/routes",
        class: "text-xl text-white/90 hover:text-white"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Routes`);
          } else {
            return [
              createTextVNode("Routes")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/statistics",
        class: "text-xl text-white/90 hover:text-white"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Statistics`);
          } else {
            return [
              createTextVNode("Statistics")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/about",
        class: "text-xl text-white/90 hover:text-white",
        "aria-label": "About",
        title: "About"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "flowbite:info-circle-outline",
              class: "text-2xl relative top-[4px]"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UIcon, {
                name: "flowbite:info-circle-outline",
                class: "text-2xl relative top-[4px]"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/configuration",
        class: "text-xl text-white/90 hover:text-white",
        "aria-label": "Configuration",
        title: "Configuration"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "flowbite:cog-outline",
              class: "text-2xl relative top-[4px]"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UIcon, {
                name: "flowbite:cog-outline",
                class: "text-2xl relative top-[4px]"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<button class="text-xl text-white/90 hover:text-white ml-2" aria-label="Toggle dark mode" title="Toggle dark mode">`);
      if (isDark.value) {
        _push(ssrRenderComponent(_component_UIcon, {
          name: "flowbite:sun-outline",
          class: "text-2xl relative top-[4px]"
        }, null, _parent));
      } else {
        _push(ssrRenderComponent(_component_UIcon, {
          name: "flowbite:moon-outline",
          class: "text-2xl relative top-[4px]"
        }, null, _parent));
      }
      _push(`</button></nav></div></header>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UHeader.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main$3, { __name: "UHeader" });
const _sfc_main$2 = {};
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs) {
  _push(`<main${ssrRenderAttrs(mergeProps({ class: "flex-1 max-w-6xl mx-auto px-4 py-6" }, _attrs))}>`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</main>`);
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UMain.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender$2]]), { __name: "UMain" });
const _sfc_main$1 = {};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs) {
  const _component_NuxtLink = __nuxt_component_0$1;
  _push(`<footer${ssrRenderAttrs(mergeProps({ class: "fts mt-8" }, _attrs))}><div class="max-w-6xl mx-auto px-4 py-4 text-l text-white/80 flex justify-between"><div>Feats - keep track of your bicycle rides and planned routes</div><div>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/configuration",
    class: "text-white/90 hover:text-white hover:underline"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Configuration`);
      } else {
        return [
          createTextVNode("Configuration")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`<span class="mx-2">|</span>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/about",
    class: "text-white/90 hover:text-white hover:underline"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`About`);
      } else {
        return [
          createTextVNode("About")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div></footer>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UFooter.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_2 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender$1]]), { __name: "UFooter" });
const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_UHeader = __nuxt_component_0;
  const _component_UMain = __nuxt_component_1;
  const _component_UFooter = __nuxt_component_2;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen flex flex-col" }, _attrs))}>`);
  _push(ssrRenderComponent(_component_UHeader, null, null, _parent));
  _push(ssrRenderComponent(_component_UMain, null, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
      } else {
        return [
          renderSlot(_ctx.$slots, "default")
        ];
      }
    }),
    _: 3
  }, _parent));
  _push(ssrRenderComponent(_component_UFooter, null, null, _parent));
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _default = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { _default as default };
//# sourceMappingURL=default-LjlI1URw.mjs.map
