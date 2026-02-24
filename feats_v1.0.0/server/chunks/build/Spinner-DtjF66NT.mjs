import { useSlots, toRef, computed, useTemplateRef, unref, mergeProps, withCtx, openBlock, createBlock, renderSlot, createCommentVNode, Fragment, renderList, toDisplayString, createTextVNode, createVNode, inject, provide, toValue, ref, watch, resolveDynamicComponent, useModel, mergeModels, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderClass, ssrRenderSlot, ssrRenderList, ssrInterpolate, ssrRenderVNode, ssrRenderAttrs } from 'vue/server-renderer';
import { useForwardPropsEmits, SelectRoot, SelectTrigger, SelectPortal, SelectContent, SelectGroup, SelectLabel, SelectSeparator, SelectItem, SelectItemText, SelectItemIndicator, SelectArrow, Primitive, Slot } from 'reka-ui';
import { A as defu, C as isEqual } from '../nitro/nitro.mjs';
import { reactivePick, useDebounceFn } from '@vueuse/core';
import { a as useAppConfig, _ as _export_sfc, b as appConfig } from './server.mjs';
import { createTV } from 'tailwind-variants';
import { _ as _sfc_main$4 } from './useGlobalLoading-FpTo0JxB.mjs';

var _a;
const fieldGroupInjectionKey = /* @__PURE__ */ Symbol("nuxt-ui.field-group");
function useFieldGroup(props) {
  const fieldGroup = inject(fieldGroupInjectionKey, void 0);
  return {
    orientation: computed(() => fieldGroup == null ? void 0 : fieldGroup.value.orientation),
    size: computed(() => {
      var _a2;
      return (_a2 = props == null ? void 0 : props.size) != null ? _a2 : fieldGroup == null ? void 0 : fieldGroup.value.size;
    })
  };
}
function useComponentIcons(componentProps) {
  const appConfig2 = useAppConfig();
  const props = computed(() => toValue(componentProps));
  const isLeading = computed(() => props.value.icon && props.value.leading || props.value.icon && !props.value.trailing || props.value.loading && !props.value.trailing || !!props.value.leadingIcon);
  const isTrailing = computed(() => props.value.icon && props.value.trailing || props.value.loading && props.value.trailing || !!props.value.trailingIcon);
  const leadingIconName = computed(() => {
    if (props.value.loading) {
      return props.value.loadingIcon || appConfig2.ui.icons.loading;
    }
    return props.value.leadingIcon || props.value.icon;
  });
  const trailingIconName = computed(() => {
    if (props.value.loading && !isLeading.value) {
      return props.value.loadingIcon || appConfig2.ui.icons.loading;
    }
    return props.value.trailingIcon || props.value.icon;
  });
  return {
    isLeading,
    isTrailing,
    leadingIconName,
    trailingIconName
  };
}
const formOptionsInjectionKey = /* @__PURE__ */ Symbol("nuxt-ui.form-options");
const formBusInjectionKey = /* @__PURE__ */ Symbol("nuxt-ui.form-events");
const formFieldInjectionKey = /* @__PURE__ */ Symbol("nuxt-ui.form-field");
const inputIdInjectionKey = /* @__PURE__ */ Symbol("nuxt-ui.input-id");
function useFormField(props, opts) {
  var _a2, _b;
  const formOptions = inject(formOptionsInjectionKey, void 0);
  const formBus = inject(formBusInjectionKey, void 0);
  const formField = inject(formFieldInjectionKey, void 0);
  const inputId = inject(inputIdInjectionKey, void 0);
  provide(formFieldInjectionKey, void 0);
  if (formField && inputId) {
    if (props == null ? void 0 : props.id) {
      inputId.value = props == null ? void 0 : props.id;
    }
  }
  function emitFormEvent(type, name, eager) {
    if (formBus && formField && name) {
      formBus.emit({ type, name, eager });
    }
  }
  function emitFormBlur() {
    emitFormEvent("blur", formField == null ? void 0 : formField.value.name);
  }
  function emitFormFocus() {
    emitFormEvent("focus", formField == null ? void 0 : formField.value.name);
  }
  function emitFormChange() {
    emitFormEvent("change", formField == null ? void 0 : formField.value.name);
  }
  const emitFormInput = useDebounceFn(
    () => {
      emitFormEvent("input", formField == null ? void 0 : formField.value.name, true);
    },
    (_b = (_a2 = formField == null ? void 0 : formField.value.validateOnInputDelay) != null ? _a2 : formOptions == null ? void 0 : formOptions.value.validateOnInputDelay) != null ? _b : 0
  );
  return {
    id: computed(() => {
      var _a3;
      return (_a3 = props == null ? void 0 : props.id) != null ? _a3 : inputId == null ? void 0 : inputId.value;
    }),
    name: computed(() => {
      var _a3;
      return (_a3 = props == null ? void 0 : props.name) != null ? _a3 : formField == null ? void 0 : formField.value.name;
    }),
    size: computed(() => {
      var _a3;
      return (_a3 = props == null ? void 0 : props.size) != null ? _a3 : formField == null ? void 0 : formField.value.size;
    }),
    color: computed(() => (formField == null ? void 0 : formField.value.error) ? "error" : props == null ? void 0 : props.color),
    highlight: computed(() => (formField == null ? void 0 : formField.value.error) ? true : props == null ? void 0 : props.highlight),
    disabled: computed(() => (formOptions == null ? void 0 : formOptions.value.disabled) || (props == null ? void 0 : props.disabled)),
    emitFormBlur,
    emitFormInput,
    emitFormChange,
    emitFormFocus,
    ariaAttrs: computed(() => {
      if (!(formField == null ? void 0 : formField.value)) return;
      const descriptiveAttrs = ["error", "hint", "description", "help"].filter((type) => {
        var _a3;
        return (_a3 = formField == null ? void 0 : formField.value) == null ? void 0 : _a3[type];
      }).map((type) => `${formField == null ? void 0 : formField.value.ariaId}-${type}`) || [];
      const attrs = {
        "aria-invalid": !!(formField == null ? void 0 : formField.value.error)
      };
      if (descriptiveAttrs.length > 0) {
        attrs["aria-describedby"] = descriptiveAttrs.join(" ");
      }
      return attrs;
    })
  };
}
const portalTargetInjectionKey = /* @__PURE__ */ Symbol("nuxt-ui.portal-target");
function usePortal(portal) {
  const globalPortal = inject(portalTargetInjectionKey, void 0);
  const value = computed(() => portal.value === true ? globalPortal == null ? void 0 : globalPortal.value : portal.value);
  const disabled = computed(() => typeof value.value === "boolean" ? !value.value : false);
  const to = computed(() => typeof value.value === "boolean" ? "body" : value.value);
  return computed(() => ({
    to: to.value,
    disabled: disabled.value
  }));
}
function get(object, path, defaultValue) {
  if (typeof path === "string") {
    path = path.split(".").map((key) => {
      const numKey = Number(key);
      return Number.isNaN(numKey) ? key : numKey;
    });
  }
  let result = object;
  for (const key of path) {
    if (result === void 0 || result === null) {
      return defaultValue;
    }
    result = result[key];
  }
  return result !== void 0 ? result : defaultValue;
}
function looseToNumber(val) {
  const n = Number.parseFloat(val);
  return Number.isNaN(n) ? val : n;
}
function compare(value, currentValue, comparator) {
  if (value === void 0 || currentValue === void 0) {
    return false;
  }
  if (typeof value === "string") {
    return value === currentValue;
  }
  if (typeof comparator === "function") {
    return comparator(value, currentValue);
  }
  if (typeof comparator === "string") {
    return get(value, comparator) === get(currentValue, comparator);
  }
  return isEqual(value, currentValue);
}
function isEmpty(value) {
  if (value == null) {
    return true;
  }
  if (typeof value === "boolean" || typeof value === "number") {
    return false;
  }
  if (typeof value === "string") {
    return value.trim().length === 0;
  }
  if (Array.isArray(value)) {
    return value.length === 0;
  }
  if (value instanceof Map || value instanceof Set) {
    return value.size === 0;
  }
  if (value instanceof Date || value instanceof RegExp || typeof value === "function") {
    return false;
  }
  if (typeof value === "object") {
    for (const _ in value) {
      if (Object.prototype.hasOwnProperty.call(value, _)) {
        return false;
      }
    }
    return true;
  }
  return false;
}
function getDisplayValue(items, value, options = {}) {
  const { valueKey, labelKey, by } = options;
  const foundItem = items.find((item) => {
    const itemValue = typeof item === "object" && item !== null && valueKey ? get(item, valueKey) : item;
    return compare(itemValue, value, by);
  });
  if (isEmpty(value) && foundItem) {
    return labelKey ? get(foundItem, labelKey) : void 0;
  }
  if (isEmpty(value)) {
    return void 0;
  }
  const source = foundItem != null ? foundItem : value;
  if (source === null || source === void 0) {
    return void 0;
  }
  if (typeof source === "object") {
    return labelKey ? get(source, labelKey) : void 0;
  }
  return String(source);
}
function isArrayOfArray(item) {
  return Array.isArray(item[0]);
}
const appConfigTv = appConfig;
const tv = /* @__PURE__ */ createTV((_a = appConfigTv.ui) == null ? void 0 : _a.tv);
const ImageComponent = "img";
const avatarGroupInjectionKey = /* @__PURE__ */ Symbol("nuxt-ui.avatar-group");
function useAvatarGroup(props) {
  const avatarGroup = inject(avatarGroupInjectionKey, void 0);
  const size = computed(() => {
    var _a2;
    return (_a2 = props.size) != null ? _a2 : avatarGroup == null ? void 0 : avatarGroup.value.size;
  });
  provide(avatarGroupInjectionKey, computed(() => ({ size: size.value })));
  return {
    size
  };
}
const theme$2 = {
  "slots": {
    "root": "relative inline-flex items-center justify-center shrink-0",
    "base": "rounded-full ring ring-bg flex items-center justify-center text-inverted font-medium whitespace-nowrap"
  },
  "variants": {
    "color": {
      "primary": "bg-primary",
      "secondary": "bg-secondary",
      "success": "bg-success",
      "info": "bg-info",
      "warning": "bg-warning",
      "error": "bg-error",
      "neutral": "bg-inverted"
    },
    "size": {
      "3xs": "h-[4px] min-w-[4px] text-[4px]",
      "2xs": "h-[5px] min-w-[5px] text-[5px]",
      "xs": "h-[6px] min-w-[6px] text-[6px]",
      "sm": "h-[7px] min-w-[7px] text-[7px]",
      "md": "h-[8px] min-w-[8px] text-[8px]",
      "lg": "h-[9px] min-w-[9px] text-[9px]",
      "xl": "h-[10px] min-w-[10px] text-[10px]",
      "2xl": "h-[11px] min-w-[11px] text-[11px]",
      "3xl": "h-[12px] min-w-[12px] text-[12px]"
    },
    "position": {
      "top-right": "top-0 right-0",
      "bottom-right": "bottom-0 right-0",
      "top-left": "top-0 left-0",
      "bottom-left": "bottom-0 left-0"
    },
    "inset": {
      "false": ""
    },
    "standalone": {
      "false": "absolute"
    }
  },
  "compoundVariants": [
    {
      "position": "top-right",
      "inset": false,
      "class": "-translate-y-1/2 translate-x-1/2 transform"
    },
    {
      "position": "bottom-right",
      "inset": false,
      "class": "translate-y-1/2 translate-x-1/2 transform"
    },
    {
      "position": "top-left",
      "inset": false,
      "class": "-translate-y-1/2 -translate-x-1/2 transform"
    },
    {
      "position": "bottom-left",
      "inset": false,
      "class": "translate-y-1/2 -translate-x-1/2 transform"
    }
  ],
  "defaultVariants": {
    "size": "md",
    "color": "primary",
    "position": "top-right"
  }
};
const _sfc_main$3 = /* @__PURE__ */ Object.assign({ inheritAttrs: false }, {
  __name: "UChip",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    as: { type: null, required: false },
    text: { type: [String, Number], required: false },
    color: { type: null, required: false },
    size: { type: null, required: false },
    position: { type: null, required: false },
    inset: { type: Boolean, required: false, default: false },
    standalone: { type: Boolean, required: false, default: false },
    class: { type: null, required: false },
    ui: { type: null, required: false }
  }, {
    "show": { type: Boolean, ...{ default: true } },
    "showModifiers": {}
  }),
  emits: ["update:show"],
  setup(__props) {
    const props = __props;
    const show = useModel(__props, "show", { type: Boolean, ...{ default: true } });
    const { size } = useAvatarGroup(props);
    const appConfig2 = useAppConfig();
    const ui = computed(() => {
      var _a2;
      return tv({ extend: tv(theme$2), ...((_a2 = appConfig2.ui) == null ? void 0 : _a2.chip) || {} })({
        color: props.color,
        size: size.value,
        position: props.position,
        inset: props.inset,
        standalone: props.standalone
      });
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a2;
      _push(ssrRenderComponent(unref(Primitive), mergeProps({
        as: __props.as,
        "data-slot": "root",
        class: ui.value.root({ class: [(_a2 = props.ui) == null ? void 0 : _a2.root, props.class] })
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a3, _b;
          if (_push2) {
            _push2(ssrRenderComponent(unref(Slot), _ctx.$attrs, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push3, _parent3, _scopeId2);
                } else {
                  return [
                    renderSlot(_ctx.$slots, "default")
                  ];
                }
              }),
              _: 3
            }, _parent2, _scopeId));
            if (show.value) {
              _push2(`<span data-slot="base" class="${ssrRenderClass(ui.value.base({ class: (_a3 = props.ui) == null ? void 0 : _a3.base }))}"${_scopeId}>`);
              ssrRenderSlot(_ctx.$slots, "content", {}, () => {
                _push2(`${ssrInterpolate(__props.text)}`);
              }, _push2, _parent2, _scopeId);
              _push2(`</span>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode(unref(Slot), _ctx.$attrs, {
                default: withCtx(() => [
                  renderSlot(_ctx.$slots, "default")
                ]),
                _: 3
              }, 16),
              show.value ? (openBlock(), createBlock("span", {
                key: 0,
                "data-slot": "base",
                class: ui.value.base({ class: (_b = props.ui) == null ? void 0 : _b.base })
              }, [
                renderSlot(_ctx.$slots, "content", {}, () => [
                  createTextVNode(toDisplayString(__props.text), 1)
                ])
              ], 2)) : createCommentVNode("", true)
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/ui/dist/runtime/components/Chip.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const theme$1 = {
  "slots": {
    "root": "inline-flex items-center justify-center shrink-0 select-none rounded-full align-middle bg-elevated",
    "image": "h-full w-full rounded-[inherit] object-cover",
    "fallback": "font-medium leading-none text-muted truncate",
    "icon": "text-muted shrink-0"
  },
  "variants": {
    "size": {
      "3xs": {
        "root": "size-4 text-[8px]"
      },
      "2xs": {
        "root": "size-5 text-[10px]"
      },
      "xs": {
        "root": "size-6 text-xs"
      },
      "sm": {
        "root": "size-7 text-sm"
      },
      "md": {
        "root": "size-8 text-base"
      },
      "lg": {
        "root": "size-9 text-lg"
      },
      "xl": {
        "root": "size-10 text-xl"
      },
      "2xl": {
        "root": "size-11 text-[22px]"
      },
      "3xl": {
        "root": "size-12 text-2xl"
      }
    }
  },
  "defaultVariants": {
    "size": "md"
  }
};
const _sfc_main$2 = /* @__PURE__ */ Object.assign({ inheritAttrs: false }, {
  __name: "UAvatar",
  __ssrInlineRender: true,
  props: {
    as: { type: null, required: false },
    src: { type: String, required: false },
    alt: { type: String, required: false },
    icon: { type: null, required: false },
    text: { type: String, required: false },
    size: { type: null, required: false },
    chip: { type: [Boolean, Object], required: false },
    class: { type: null, required: false },
    style: { type: null, required: false },
    ui: { type: null, required: false }
  },
  setup(__props) {
    const props = __props;
    const as = computed(() => {
      var _a2;
      if (typeof props.as === "string" || typeof ((_a2 = props.as) == null ? void 0 : _a2.render) === "function") {
        return { root: props.as };
      }
      return defu(props.as, { root: "span" });
    });
    const fallback = computed(() => props.text || (props.alt || "").split(" ").map((word) => word.charAt(0)).join("").substring(0, 2));
    const appConfig2 = useAppConfig();
    const { size } = useAvatarGroup(props);
    const ui = computed(() => {
      var _a2;
      return tv({ extend: tv(theme$1), ...((_a2 = appConfig2.ui) == null ? void 0 : _a2.avatar) || {} })({
        size: size.value
      });
    });
    const sizePx = computed(() => ({
      "3xs": 16,
      "2xs": 20,
      "xs": 24,
      "sm": 28,
      "md": 32,
      "lg": 36,
      "xl": 40,
      "2xl": 44,
      "3xl": 48
    })[props.size || "md"]);
    const error = ref(false);
    watch(() => props.src, () => {
      if (error.value) {
        error.value = false;
      }
    });
    function onError() {
      error.value = true;
    }
    return (_ctx, _push, _parent, _attrs) => {
      var _a2;
      ssrRenderVNode(_push, createVNode(resolveDynamicComponent(props.chip ? _sfc_main$3 : unref(Primitive)), mergeProps({
        as: as.value.root
      }, props.chip ? typeof props.chip === "object" ? { inset: true, ...props.chip } : { inset: true } : {}, {
        "data-slot": "root",
        class: ui.value.root({ class: [(_a2 = props.ui) == null ? void 0 : _a2.root, props.class] }),
        style: props.style
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a3, _b;
          if (_push2) {
            if (__props.src && !error.value) {
              ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(as.value.img || unref(ImageComponent)), mergeProps({
                src: __props.src,
                alt: __props.alt,
                width: sizePx.value,
                height: sizePx.value
              }, _ctx.$attrs, {
                "data-slot": "image",
                class: ui.value.image({ class: (_a3 = props.ui) == null ? void 0 : _a3.image }),
                onError
              }), null), _parent2, _scopeId);
            } else {
              _push2(ssrRenderComponent(unref(Slot), _ctx.$attrs, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    ssrRenderSlot(_ctx.$slots, "default", {}, () => {
                      var _a4, _b2;
                      if (__props.icon) {
                        _push3(ssrRenderComponent(_sfc_main$4, {
                          name: __props.icon,
                          "data-slot": "icon",
                          class: ui.value.icon({ class: (_a4 = props.ui) == null ? void 0 : _a4.icon })
                        }, null, _parent3, _scopeId2));
                      } else {
                        _push3(`<span data-slot="fallback" class="${ssrRenderClass(ui.value.fallback({ class: (_b2 = props.ui) == null ? void 0 : _b2.fallback }))}"${_scopeId2}>${ssrInterpolate(fallback.value || "\xA0")}</span>`);
                      }
                    }, _push3, _parent3, _scopeId2);
                  } else {
                    return [
                      renderSlot(_ctx.$slots, "default", {}, () => {
                        var _a4, _b2;
                        return [
                          __props.icon ? (openBlock(), createBlock(_sfc_main$4, {
                            key: 0,
                            name: __props.icon,
                            "data-slot": "icon",
                            class: ui.value.icon({ class: (_a4 = props.ui) == null ? void 0 : _a4.icon })
                          }, null, 8, ["name", "class"])) : (openBlock(), createBlock("span", {
                            key: 1,
                            "data-slot": "fallback",
                            class: ui.value.fallback({ class: (_b2 = props.ui) == null ? void 0 : _b2.fallback })
                          }, toDisplayString(fallback.value || "\xA0"), 3))
                        ];
                      })
                    ];
                  }
                }),
                _: 3
              }, _parent2, _scopeId));
            }
          } else {
            return [
              __props.src && !error.value ? (openBlock(), createBlock(resolveDynamicComponent(as.value.img || unref(ImageComponent)), mergeProps({
                key: 0,
                src: __props.src,
                alt: __props.alt,
                width: sizePx.value,
                height: sizePx.value
              }, _ctx.$attrs, {
                "data-slot": "image",
                class: ui.value.image({ class: (_b = props.ui) == null ? void 0 : _b.image }),
                onError
              }), null, 16, ["src", "alt", "width", "height", "class"])) : (openBlock(), createBlock(unref(Slot), mergeProps({ key: 1 }, _ctx.$attrs), {
                default: withCtx(() => [
                  renderSlot(_ctx.$slots, "default", {}, () => {
                    var _a4, _b2;
                    return [
                      __props.icon ? (openBlock(), createBlock(_sfc_main$4, {
                        key: 0,
                        name: __props.icon,
                        "data-slot": "icon",
                        class: ui.value.icon({ class: (_a4 = props.ui) == null ? void 0 : _a4.icon })
                      }, null, 8, ["name", "class"])) : (openBlock(), createBlock("span", {
                        key: 1,
                        "data-slot": "fallback",
                        class: ui.value.fallback({ class: (_b2 = props.ui) == null ? void 0 : _b2.fallback })
                      }, toDisplayString(fallback.value || "\xA0"), 3))
                    ];
                  })
                ]),
                _: 3
              }, 16))
            ];
          }
        }),
        _: 3
      }), _parent);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/ui/dist/runtime/components/Avatar.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const theme = {
  "slots": {
    "base": [
      "relative group rounded-md inline-flex items-center focus:outline-none disabled:cursor-not-allowed disabled:opacity-75",
      "transition-colors"
    ],
    "leading": "absolute inset-y-0 start-0 flex items-center",
    "leadingIcon": "shrink-0 text-dimmed",
    "leadingAvatar": "shrink-0",
    "leadingAvatarSize": "",
    "trailing": "absolute inset-y-0 end-0 flex items-center",
    "trailingIcon": "shrink-0 text-dimmed",
    "value": "truncate pointer-events-none",
    "placeholder": "truncate text-dimmed",
    "arrow": "fill-default",
    "content": "max-h-60 w-(--reka-select-trigger-width) bg-default shadow-lg rounded-md ring ring-default overflow-hidden data-[state=open]:animate-[scale-in_100ms_ease-out] data-[state=closed]:animate-[scale-out_100ms_ease-in] origin-(--reka-select-content-transform-origin) pointer-events-auto flex flex-col",
    "viewport": "relative divide-y divide-default scroll-py-1 overflow-y-auto flex-1",
    "group": "p-1 isolate",
    "empty": "text-center text-muted",
    "label": "font-semibold text-highlighted",
    "separator": "-mx-1 my-1 h-px bg-border",
    "item": [
      "group relative w-full flex items-start select-none outline-none before:absolute before:z-[-1] before:inset-px before:rounded-md data-disabled:cursor-not-allowed data-disabled:opacity-75 text-default data-highlighted:not-data-disabled:text-highlighted data-highlighted:not-data-disabled:before:bg-elevated/50",
      "transition-colors before:transition-colors"
    ],
    "itemLeadingIcon": [
      "shrink-0 text-dimmed group-data-highlighted:not-group-data-disabled:text-default",
      "transition-colors"
    ],
    "itemLeadingAvatar": "shrink-0",
    "itemLeadingAvatarSize": "",
    "itemLeadingChip": "shrink-0",
    "itemLeadingChipSize": "",
    "itemTrailing": "ms-auto inline-flex gap-1.5 items-center",
    "itemTrailingIcon": "shrink-0",
    "itemWrapper": "flex-1 flex flex-col min-w-0",
    "itemLabel": "truncate",
    "itemDescription": "truncate text-muted"
  },
  "variants": {
    "fieldGroup": {
      "horizontal": "not-only:first:rounded-e-none not-only:last:rounded-s-none not-last:not-first:rounded-none focus-visible:z-[1]",
      "vertical": "not-only:first:rounded-b-none not-only:last:rounded-t-none not-last:not-first:rounded-none focus-visible:z-[1]"
    },
    "size": {
      "xs": {
        "base": "px-2 py-1 text-xs gap-1",
        "leading": "ps-2",
        "trailing": "pe-2",
        "leadingIcon": "size-4",
        "leadingAvatarSize": "3xs",
        "trailingIcon": "size-4",
        "label": "p-1 text-[10px]/3 gap-1",
        "item": "p-1 text-xs gap-1",
        "itemLeadingIcon": "size-4",
        "itemLeadingAvatarSize": "3xs",
        "itemLeadingChip": "size-4",
        "itemLeadingChipSize": "sm",
        "itemTrailingIcon": "size-4",
        "empty": "p-1 text-xs"
      },
      "sm": {
        "base": "px-2.5 py-1.5 text-xs gap-1.5",
        "leading": "ps-2.5",
        "trailing": "pe-2.5",
        "leadingIcon": "size-4",
        "leadingAvatarSize": "3xs",
        "trailingIcon": "size-4",
        "label": "p-1.5 text-[10px]/3 gap-1.5",
        "item": "p-1.5 text-xs gap-1.5",
        "itemLeadingIcon": "size-4",
        "itemLeadingAvatarSize": "3xs",
        "itemLeadingChip": "size-4",
        "itemLeadingChipSize": "sm",
        "itemTrailingIcon": "size-4",
        "empty": "p-1.5 text-xs"
      },
      "md": {
        "base": "px-2.5 py-1.5 text-sm gap-1.5",
        "leading": "ps-2.5",
        "trailing": "pe-2.5",
        "leadingIcon": "size-5",
        "leadingAvatarSize": "2xs",
        "trailingIcon": "size-5",
        "label": "p-1.5 text-xs gap-1.5",
        "item": "p-1.5 text-sm gap-1.5",
        "itemLeadingIcon": "size-5",
        "itemLeadingAvatarSize": "2xs",
        "itemLeadingChip": "size-5",
        "itemLeadingChipSize": "md",
        "itemTrailingIcon": "size-5",
        "empty": "p-1.5 text-sm"
      },
      "lg": {
        "base": "px-3 py-2 text-sm gap-2",
        "leading": "ps-3",
        "trailing": "pe-3",
        "leadingIcon": "size-5",
        "leadingAvatarSize": "2xs",
        "trailingIcon": "size-5",
        "label": "p-2 text-xs gap-2",
        "item": "p-2 text-sm gap-2",
        "itemLeadingIcon": "size-5",
        "itemLeadingAvatarSize": "2xs",
        "itemLeadingChip": "size-5",
        "itemLeadingChipSize": "md",
        "itemTrailingIcon": "size-5",
        "empty": "p-2 text-sm"
      },
      "xl": {
        "base": "px-3 py-2 text-base gap-2",
        "leading": "ps-3",
        "trailing": "pe-3",
        "leadingIcon": "size-6",
        "leadingAvatarSize": "xs",
        "trailingIcon": "size-6",
        "label": "p-2 text-sm gap-2",
        "item": "p-2 text-base gap-2",
        "itemLeadingIcon": "size-6",
        "itemLeadingAvatarSize": "xs",
        "itemLeadingChip": "size-6",
        "itemLeadingChipSize": "lg",
        "itemTrailingIcon": "size-6",
        "empty": "p-2 text-base"
      }
    },
    "variant": {
      "outline": "text-highlighted bg-default ring ring-inset ring-accented",
      "soft": "text-highlighted bg-elevated/50 hover:bg-elevated focus:bg-elevated disabled:bg-elevated/50",
      "subtle": "text-highlighted bg-elevated ring ring-inset ring-accented",
      "ghost": "text-highlighted bg-transparent hover:bg-elevated focus:bg-elevated disabled:bg-transparent dark:disabled:bg-transparent",
      "none": "text-highlighted bg-transparent"
    },
    "color": {
      "primary": "",
      "secondary": "",
      "success": "",
      "info": "",
      "warning": "",
      "error": "",
      "neutral": ""
    },
    "leading": {
      "true": ""
    },
    "trailing": {
      "true": ""
    },
    "loading": {
      "true": ""
    },
    "highlight": {
      "true": ""
    },
    "type": {
      "file": "file:me-1.5 file:font-medium file:text-muted file:outline-none"
    }
  },
  "compoundVariants": [
    {
      "color": "primary",
      "variant": [
        "outline",
        "subtle"
      ],
      "class": "focus:ring-2 focus:ring-inset focus:ring-primary"
    },
    {
      "color": "secondary",
      "variant": [
        "outline",
        "subtle"
      ],
      "class": "focus:ring-2 focus:ring-inset focus:ring-secondary"
    },
    {
      "color": "success",
      "variant": [
        "outline",
        "subtle"
      ],
      "class": "focus:ring-2 focus:ring-inset focus:ring-success"
    },
    {
      "color": "info",
      "variant": [
        "outline",
        "subtle"
      ],
      "class": "focus:ring-2 focus:ring-inset focus:ring-info"
    },
    {
      "color": "warning",
      "variant": [
        "outline",
        "subtle"
      ],
      "class": "focus:ring-2 focus:ring-inset focus:ring-warning"
    },
    {
      "color": "error",
      "variant": [
        "outline",
        "subtle"
      ],
      "class": "focus:ring-2 focus:ring-inset focus:ring-error"
    },
    {
      "color": "primary",
      "highlight": true,
      "class": "ring ring-inset ring-primary"
    },
    {
      "color": "secondary",
      "highlight": true,
      "class": "ring ring-inset ring-secondary"
    },
    {
      "color": "success",
      "highlight": true,
      "class": "ring ring-inset ring-success"
    },
    {
      "color": "info",
      "highlight": true,
      "class": "ring ring-inset ring-info"
    },
    {
      "color": "warning",
      "highlight": true,
      "class": "ring ring-inset ring-warning"
    },
    {
      "color": "error",
      "highlight": true,
      "class": "ring ring-inset ring-error"
    },
    {
      "color": "neutral",
      "variant": [
        "outline",
        "subtle"
      ],
      "class": "focus:ring-2 focus:ring-inset focus:ring-inverted"
    },
    {
      "color": "neutral",
      "highlight": true,
      "class": "ring ring-inset ring-inverted"
    },
    {
      "leading": true,
      "size": "xs",
      "class": "ps-7"
    },
    {
      "leading": true,
      "size": "sm",
      "class": "ps-8"
    },
    {
      "leading": true,
      "size": "md",
      "class": "ps-9"
    },
    {
      "leading": true,
      "size": "lg",
      "class": "ps-10"
    },
    {
      "leading": true,
      "size": "xl",
      "class": "ps-11"
    },
    {
      "trailing": true,
      "size": "xs",
      "class": "pe-7"
    },
    {
      "trailing": true,
      "size": "sm",
      "class": "pe-8"
    },
    {
      "trailing": true,
      "size": "md",
      "class": "pe-9"
    },
    {
      "trailing": true,
      "size": "lg",
      "class": "pe-10"
    },
    {
      "trailing": true,
      "size": "xl",
      "class": "pe-11"
    },
    {
      "loading": true,
      "leading": true,
      "class": {
        "leadingIcon": "animate-spin"
      }
    },
    {
      "loading": true,
      "leading": false,
      "trailing": true,
      "class": {
        "trailingIcon": "animate-spin"
      }
    }
  ],
  "defaultVariants": {
    "size": "md",
    "color": "primary",
    "variant": "outline"
  }
};
const _sfc_main$1 = /* @__PURE__ */ Object.assign({ inheritAttrs: false }, {
  __name: "USelect",
  __ssrInlineRender: true,
  props: {
    id: { type: String, required: false },
    placeholder: { type: String, required: false },
    color: { type: null, required: false },
    variant: { type: null, required: false },
    size: { type: null, required: false },
    trailingIcon: { type: null, required: false },
    selectedIcon: { type: null, required: false },
    content: { type: Object, required: false },
    arrow: { type: [Boolean, Object], required: false },
    portal: { type: [Boolean, String], required: false, skipCheck: true, default: true },
    valueKey: { type: null, required: false, default: "value" },
    labelKey: { type: null, required: false, default: "label" },
    descriptionKey: { type: null, required: false, default: "description" },
    items: { type: null, required: false },
    defaultValue: { type: null, required: false },
    modelValue: { type: null, required: false },
    modelModifiers: { type: Object, required: false },
    multiple: { type: Boolean, required: false },
    by: { type: [String, Function], required: false },
    highlight: { type: Boolean, required: false },
    autofocus: { type: Boolean, required: false },
    autofocusDelay: { type: Number, required: false, default: 0 },
    class: { type: null, required: false },
    ui: { type: null, required: false },
    open: { type: Boolean, required: false },
    defaultOpen: { type: Boolean, required: false },
    autocomplete: { type: String, required: false },
    disabled: { type: Boolean, required: false },
    name: { type: String, required: false },
    required: { type: Boolean, required: false },
    icon: { type: null, required: false },
    avatar: { type: Object, required: false },
    leading: { type: Boolean, required: false },
    leadingIcon: { type: null, required: false },
    trailing: { type: Boolean, required: false },
    loading: { type: Boolean, required: false },
    loadingIcon: { type: null, required: false }
  },
  emits: ["update:open", "change", "blur", "focus", "update:modelValue"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const slots = useSlots();
    const appConfig2 = useAppConfig();
    const rootProps = useForwardPropsEmits(reactivePick(props, "open", "defaultOpen", "disabled", "autocomplete", "required", "multiple", "by"), emits);
    const portalProps = usePortal(toRef(() => props.portal));
    const contentProps = toRef(() => defu(props.content, { side: "bottom", sideOffset: 8, collisionPadding: 8, position: "popper" }));
    const arrowProps = toRef(() => props.arrow);
    const { emitFormChange, emitFormInput, emitFormBlur, emitFormFocus, size: formGroupSize, color, id, name, highlight, disabled, ariaAttrs } = useFormField(props);
    const { orientation, size: fieldGroupSize } = useFieldGroup(props);
    const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons(toRef(() => defu(props, { trailingIcon: appConfig2.ui.icons.chevronDown })));
    const selectSize = computed(() => fieldGroupSize.value || formGroupSize.value);
    const ui = computed(() => {
      var _a2;
      return tv({ extend: tv(theme), ...((_a2 = appConfig2.ui) == null ? void 0 : _a2.select) || {} })({
        color: color.value,
        variant: props.variant,
        size: selectSize == null ? void 0 : selectSize.value,
        loading: props.loading,
        highlight: highlight.value,
        leading: isLeading.value || !!props.avatar || !!slots.leading,
        trailing: isTrailing.value || !!slots.trailing,
        fieldGroup: orientation.value
      });
    });
    const groups = computed(
      () => {
        var _a2;
        return ((_a2 = props.items) == null ? void 0 : _a2.length) ? isArrayOfArray(props.items) ? props.items : [props.items] : [];
      }
    );
    const items = computed(() => groups.value.flatMap((group) => group));
    function displayValue(value) {
      if (props.multiple && Array.isArray(value)) {
        const displayedValues = value.map((item) => getDisplayValue(items.value, item, {
          labelKey: props.labelKey,
          valueKey: props.valueKey,
          by: props.by
        })).filter((v) => v != null && v !== "");
        return displayedValues.length > 0 ? displayedValues.join(", ") : void 0;
      }
      return getDisplayValue(items.value, value, {
        labelKey: props.labelKey,
        valueKey: props.valueKey,
        by: props.by
      });
    }
    const triggerRef = useTemplateRef("triggerRef");
    function onUpdate(value) {
      var _a2, _b, _c, _d, _e;
      if ((_a2 = props.modelModifiers) == null ? void 0 : _a2.trim) {
        value = (_b = value == null ? void 0 : value.trim()) != null ? _b : null;
      }
      if ((_c = props.modelModifiers) == null ? void 0 : _c.number) {
        value = looseToNumber(value);
      }
      if ((_d = props.modelModifiers) == null ? void 0 : _d.nullable) {
        value != null ? value : value = null;
      }
      if ((_e = props.modelModifiers) == null ? void 0 : _e.optional) {
        value != null ? value : value = void 0;
      }
      const event = new Event("change", { target: { value } });
      emits("change", event);
      emitFormChange();
      emitFormInput();
    }
    function onUpdateOpen(value) {
      if (!value) {
        const event = new FocusEvent("blur");
        emits("blur", event);
        emitFormBlur();
      } else {
        const event = new FocusEvent("focus");
        emits("focus", event);
        emitFormFocus();
      }
    }
    function isSelectItem(item) {
      return typeof item === "object" && item !== null;
    }
    const viewportRef = useTemplateRef("viewportRef");
    __expose({
      triggerRef: toRef(() => {
        var _a2;
        return (_a2 = triggerRef.value) == null ? void 0 : _a2.$el;
      }),
      viewportRef: toRef(() => viewportRef.value)
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(SelectRoot), mergeProps({ name: unref(name) }, unref(rootProps), {
        autocomplete: __props.autocomplete,
        disabled: unref(disabled),
        "default-value": __props.defaultValue,
        "model-value": __props.modelValue,
        "onUpdate:modelValue": onUpdate,
        "onUpdate:open": onUpdateOpen
      }, _attrs), {
        default: withCtx(({ modelValue, open }, _push2, _parent2, _scopeId) => {
          var _a2, _b;
          if (_push2) {
            _push2(ssrRenderComponent(unref(SelectTrigger), mergeProps({
              id: unref(id),
              ref_key: "triggerRef",
              ref: triggerRef,
              "data-slot": "base",
              class: ui.value.base({ class: [(_a2 = props.ui) == null ? void 0 : _a2.base, props.class] })
            }, { ..._ctx.$attrs, ...unref(ariaAttrs) }), {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                var _a3, _b2, _c, _d;
                if (_push3) {
                  if (unref(isLeading) || !!__props.avatar || !!slots.leading) {
                    _push3(`<span data-slot="leading" class="${ssrRenderClass(ui.value.leading({ class: (_a3 = props.ui) == null ? void 0 : _a3.leading }))}"${_scopeId2}>`);
                    ssrRenderSlot(_ctx.$slots, "leading", {
                      modelValue,
                      open,
                      ui: ui.value
                    }, () => {
                      var _a4, _b3, _c2;
                      if (unref(isLeading) && unref(leadingIconName)) {
                        _push3(ssrRenderComponent(_sfc_main$4, {
                          name: unref(leadingIconName),
                          "data-slot": "leadingIcon",
                          class: ui.value.leadingIcon({ class: (_a4 = props.ui) == null ? void 0 : _a4.leadingIcon })
                        }, null, _parent3, _scopeId2));
                      } else if (!!__props.avatar) {
                        _push3(ssrRenderComponent(_sfc_main$2, mergeProps({
                          size: ((_b3 = props.ui) == null ? void 0 : _b3.itemLeadingAvatarSize) || ui.value.itemLeadingAvatarSize()
                        }, __props.avatar, {
                          "data-slot": "itemLeadingAvatar",
                          class: ui.value.itemLeadingAvatar({ class: (_c2 = props.ui) == null ? void 0 : _c2.itemLeadingAvatar })
                        }), null, _parent3, _scopeId2));
                      } else {
                        _push3(`<!---->`);
                      }
                    }, _push3, _parent3, _scopeId2);
                    _push3(`</span>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  ssrRenderSlot(_ctx.$slots, "default", {
                    modelValue,
                    open,
                    ui: ui.value
                  }, () => {
                    _push3(`<!--[-->`);
                    ssrRenderList([displayValue(modelValue)], (displayedModelValue) => {
                      var _a4, _b3, _c2;
                      _push3(`<!--[-->`);
                      if (displayedModelValue !== void 0 && displayedModelValue !== null) {
                        _push3(`<span data-slot="value" class="${ssrRenderClass(ui.value.value({ class: (_a4 = props.ui) == null ? void 0 : _a4.value }))}"${_scopeId2}>${ssrInterpolate(displayedModelValue)}</span>`);
                      } else {
                        _push3(`<span data-slot="placeholder" class="${ssrRenderClass(ui.value.placeholder({ class: (_b3 = props.ui) == null ? void 0 : _b3.placeholder }))}"${_scopeId2}>${ssrInterpolate((_c2 = __props.placeholder) != null ? _c2 : "\xA0")}</span>`);
                      }
                      _push3(`<!--]-->`);
                    });
                    _push3(`<!--]-->`);
                  }, _push3, _parent3, _scopeId2);
                  if (unref(isTrailing) || !!slots.trailing) {
                    _push3(`<span data-slot="trailing" class="${ssrRenderClass(ui.value.trailing({ class: (_b2 = props.ui) == null ? void 0 : _b2.trailing }))}"${_scopeId2}>`);
                    ssrRenderSlot(_ctx.$slots, "trailing", {
                      modelValue,
                      open,
                      ui: ui.value
                    }, () => {
                      var _a4;
                      if (unref(trailingIconName)) {
                        _push3(ssrRenderComponent(_sfc_main$4, {
                          name: unref(trailingIconName),
                          "data-slot": "trailingIcon",
                          class: ui.value.trailingIcon({ class: (_a4 = props.ui) == null ? void 0 : _a4.trailingIcon })
                        }, null, _parent3, _scopeId2));
                      } else {
                        _push3(`<!---->`);
                      }
                    }, _push3, _parent3, _scopeId2);
                    _push3(`</span>`);
                  } else {
                    _push3(`<!---->`);
                  }
                } else {
                  return [
                    unref(isLeading) || !!__props.avatar || !!slots.leading ? (openBlock(), createBlock("span", {
                      key: 0,
                      "data-slot": "leading",
                      class: ui.value.leading({ class: (_c = props.ui) == null ? void 0 : _c.leading })
                    }, [
                      renderSlot(_ctx.$slots, "leading", {
                        modelValue,
                        open,
                        ui: ui.value
                      }, () => {
                        var _a4, _b3, _c2;
                        return [
                          unref(isLeading) && unref(leadingIconName) ? (openBlock(), createBlock(_sfc_main$4, {
                            key: 0,
                            name: unref(leadingIconName),
                            "data-slot": "leadingIcon",
                            class: ui.value.leadingIcon({ class: (_a4 = props.ui) == null ? void 0 : _a4.leadingIcon })
                          }, null, 8, ["name", "class"])) : !!__props.avatar ? (openBlock(), createBlock(_sfc_main$2, mergeProps({
                            key: 1,
                            size: ((_b3 = props.ui) == null ? void 0 : _b3.itemLeadingAvatarSize) || ui.value.itemLeadingAvatarSize()
                          }, __props.avatar, {
                            "data-slot": "itemLeadingAvatar",
                            class: ui.value.itemLeadingAvatar({ class: (_c2 = props.ui) == null ? void 0 : _c2.itemLeadingAvatar })
                          }), null, 16, ["size", "class"])) : createCommentVNode("", true)
                        ];
                      })
                    ], 2)) : createCommentVNode("", true),
                    renderSlot(_ctx.$slots, "default", {
                      modelValue,
                      open,
                      ui: ui.value
                    }, () => [
                      (openBlock(true), createBlock(Fragment, null, renderList([displayValue(modelValue)], (displayedModelValue) => {
                        var _a4, _b3, _c2;
                        return openBlock(), createBlock(Fragment, { key: displayedModelValue }, [
                          displayedModelValue !== void 0 && displayedModelValue !== null ? (openBlock(), createBlock("span", {
                            key: 0,
                            "data-slot": "value",
                            class: ui.value.value({ class: (_a4 = props.ui) == null ? void 0 : _a4.value })
                          }, toDisplayString(displayedModelValue), 3)) : (openBlock(), createBlock("span", {
                            key: 1,
                            "data-slot": "placeholder",
                            class: ui.value.placeholder({ class: (_b3 = props.ui) == null ? void 0 : _b3.placeholder })
                          }, toDisplayString((_c2 = __props.placeholder) != null ? _c2 : "\xA0"), 3))
                        ], 64);
                      }), 128))
                    ]),
                    unref(isTrailing) || !!slots.trailing ? (openBlock(), createBlock("span", {
                      key: 1,
                      "data-slot": "trailing",
                      class: ui.value.trailing({ class: (_d = props.ui) == null ? void 0 : _d.trailing })
                    }, [
                      renderSlot(_ctx.$slots, "trailing", {
                        modelValue,
                        open,
                        ui: ui.value
                      }, () => {
                        var _a4;
                        return [
                          unref(trailingIconName) ? (openBlock(), createBlock(_sfc_main$4, {
                            key: 0,
                            name: unref(trailingIconName),
                            "data-slot": "trailingIcon",
                            class: ui.value.trailingIcon({ class: (_a4 = props.ui) == null ? void 0 : _a4.trailingIcon })
                          }, null, 8, ["name", "class"])) : createCommentVNode("", true)
                        ];
                      })
                    ], 2)) : createCommentVNode("", true)
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(SelectPortal), unref(portalProps), {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                var _a3, _b2;
                if (_push3) {
                  _push3(ssrRenderComponent(unref(SelectContent), mergeProps({
                    "data-slot": "content",
                    class: ui.value.content({ class: (_a3 = props.ui) == null ? void 0 : _a3.content })
                  }, contentProps.value), {
                    default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                      var _a4, _b3, _c, _d;
                      if (_push4) {
                        ssrRenderSlot(_ctx.$slots, "content-top", {}, null, _push4, _parent4, _scopeId3);
                        _push4(`<div role="presentation" data-slot="viewport" class="${ssrRenderClass(ui.value.viewport({ class: (_a4 = props.ui) == null ? void 0 : _a4.viewport }))}"${_scopeId3}><!--[-->`);
                        ssrRenderList(groups.value, (group, groupIndex) => {
                          var _a5;
                          _push4(ssrRenderComponent(unref(SelectGroup), {
                            key: `group-${groupIndex}`,
                            "data-slot": "group",
                            class: ui.value.group({ class: (_a5 = props.ui) == null ? void 0 : _a5.group })
                          }, {
                            default: withCtx((_3, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`<!--[-->`);
                                ssrRenderList(group, (item, index) => {
                                  var _a6, _b4, _c2, _d2, _e, _f;
                                  _push5(`<!--[-->`);
                                  if (isSelectItem(item) && item.type === "label") {
                                    _push5(ssrRenderComponent(unref(SelectLabel), {
                                      "data-slot": "label",
                                      class: ui.value.label({ class: [(_a6 = props.ui) == null ? void 0 : _a6.label, (_b4 = item.ui) == null ? void 0 : _b4.label, item.class] })
                                    }, {
                                      default: withCtx((_4, _push6, _parent6, _scopeId5) => {
                                        if (_push6) {
                                          _push6(`${ssrInterpolate(unref(get)(item, props.labelKey))}`);
                                        } else {
                                          return [
                                            createTextVNode(toDisplayString(unref(get)(item, props.labelKey)), 1)
                                          ];
                                        }
                                      }),
                                      _: 2
                                    }, _parent5, _scopeId4));
                                  } else if (isSelectItem(item) && item.type === "separator") {
                                    _push5(ssrRenderComponent(unref(SelectSeparator), {
                                      "data-slot": "separator",
                                      class: ui.value.separator({ class: [(_c2 = props.ui) == null ? void 0 : _c2.separator, (_d2 = item.ui) == null ? void 0 : _d2.separator, item.class] })
                                    }, null, _parent5, _scopeId4));
                                  } else {
                                    _push5(ssrRenderComponent(unref(SelectItem), {
                                      "data-slot": "item",
                                      class: ui.value.item({ class: [(_e = props.ui) == null ? void 0 : _e.item, isSelectItem(item) && ((_f = item.ui) == null ? void 0 : _f.item), isSelectItem(item) && item.class] }),
                                      disabled: isSelectItem(item) && item.disabled,
                                      value: isSelectItem(item) ? unref(get)(item, props.valueKey) : item,
                                      onSelect: ($event) => {
                                        var _a7;
                                        return isSelectItem(item) && ((_a7 = item.onSelect) == null ? void 0 : _a7.call(item, $event));
                                      }
                                    }, {
                                      default: withCtx((_4, _push6, _parent6, _scopeId5) => {
                                        if (_push6) {
                                          ssrRenderSlot(_ctx.$slots, "item", {
                                            item,
                                            index,
                                            ui: ui.value
                                          }, () => {
                                            var _a7, _b5, _c3, _d3, _e2, _f2, _g, _h;
                                            ssrRenderSlot(_ctx.$slots, "item-leading", {
                                              item,
                                              index,
                                              ui: ui.value
                                            }, () => {
                                              var _a8, _b6, _c4, _d4, _e3, _f3, _g2, _h2, _i, _j;
                                              if (isSelectItem(item) && item.icon) {
                                                _push6(ssrRenderComponent(_sfc_main$4, {
                                                  name: item.icon,
                                                  "data-slot": "itemLeadingIcon",
                                                  class: ui.value.itemLeadingIcon({ class: [(_a8 = props.ui) == null ? void 0 : _a8.itemLeadingIcon, (_b6 = item.ui) == null ? void 0 : _b6.itemLeadingIcon] })
                                                }, null, _parent6, _scopeId5));
                                              } else if (isSelectItem(item) && item.avatar) {
                                                _push6(ssrRenderComponent(_sfc_main$2, mergeProps({
                                                  size: ((_c4 = item.ui) == null ? void 0 : _c4.itemLeadingAvatarSize) || ((_d4 = props.ui) == null ? void 0 : _d4.itemLeadingAvatarSize) || ui.value.itemLeadingAvatarSize()
                                                }, { ref_for: true }, item.avatar, {
                                                  "data-slot": "itemLeadingAvatar",
                                                  class: ui.value.itemLeadingAvatar({ class: [(_e3 = props.ui) == null ? void 0 : _e3.itemLeadingAvatar, (_f3 = item.ui) == null ? void 0 : _f3.itemLeadingAvatar] })
                                                }), null, _parent6, _scopeId5));
                                              } else if (isSelectItem(item) && item.chip) {
                                                _push6(ssrRenderComponent(_sfc_main$3, mergeProps({
                                                  size: ((_g2 = item.ui) == null ? void 0 : _g2.itemLeadingChipSize) || ((_h2 = props.ui) == null ? void 0 : _h2.itemLeadingChipSize) || ui.value.itemLeadingChipSize(),
                                                  inset: "",
                                                  standalone: ""
                                                }, { ref_for: true }, item.chip, {
                                                  "data-slot": "itemLeadingChip",
                                                  class: ui.value.itemLeadingChip({ class: [(_i = props.ui) == null ? void 0 : _i.itemLeadingChip, (_j = item.ui) == null ? void 0 : _j.itemLeadingChip] })
                                                }), null, _parent6, _scopeId5));
                                              } else {
                                                _push6(`<!---->`);
                                              }
                                            }, _push6, _parent6, _scopeId5);
                                            _push6(`<span data-slot="itemWrapper" class="${ssrRenderClass(ui.value.itemWrapper({ class: [(_a7 = props.ui) == null ? void 0 : _a7.itemWrapper, isSelectItem(item) && ((_b5 = item.ui) == null ? void 0 : _b5.itemWrapper)] }))}"${_scopeId5}>`);
                                            _push6(ssrRenderComponent(unref(SelectItemText), {
                                              "data-slot": "itemLabel",
                                              class: ui.value.itemLabel({ class: [(_c3 = props.ui) == null ? void 0 : _c3.itemLabel, isSelectItem(item) && ((_d3 = item.ui) == null ? void 0 : _d3.itemLabel)] })
                                            }, {
                                              default: withCtx((_5, _push7, _parent7, _scopeId6) => {
                                                if (_push7) {
                                                  ssrRenderSlot(_ctx.$slots, "item-label", {
                                                    item,
                                                    index
                                                  }, () => {
                                                    _push7(`${ssrInterpolate(isSelectItem(item) ? unref(get)(item, props.labelKey) : item)}`);
                                                  }, _push7, _parent7, _scopeId6);
                                                } else {
                                                  return [
                                                    renderSlot(_ctx.$slots, "item-label", {
                                                      item,
                                                      index
                                                    }, () => [
                                                      createTextVNode(toDisplayString(isSelectItem(item) ? unref(get)(item, props.labelKey) : item), 1)
                                                    ])
                                                  ];
                                                }
                                              }),
                                              _: 2
                                            }, _parent6, _scopeId5));
                                            if (isSelectItem(item) && (unref(get)(item, props.descriptionKey) || !!slots["item-description"])) {
                                              _push6(`<span data-slot="itemDescription" class="${ssrRenderClass(ui.value.itemDescription({ class: [(_e2 = props.ui) == null ? void 0 : _e2.itemDescription, isSelectItem(item) && ((_f2 = item.ui) == null ? void 0 : _f2.itemDescription)] }))}"${_scopeId5}>`);
                                              ssrRenderSlot(_ctx.$slots, "item-description", {
                                                item,
                                                index
                                              }, () => {
                                                _push6(`${ssrInterpolate(unref(get)(item, props.descriptionKey))}`);
                                              }, _push6, _parent6, _scopeId5);
                                              _push6(`</span>`);
                                            } else {
                                              _push6(`<!---->`);
                                            }
                                            _push6(`</span><span data-slot="itemTrailing" class="${ssrRenderClass(ui.value.itemTrailing({ class: [(_g = props.ui) == null ? void 0 : _g.itemTrailing, isSelectItem(item) && ((_h = item.ui) == null ? void 0 : _h.itemTrailing)] }))}"${_scopeId5}>`);
                                            ssrRenderSlot(_ctx.$slots, "item-trailing", {
                                              item,
                                              index,
                                              ui: ui.value
                                            }, null, _push6, _parent6, _scopeId5);
                                            _push6(ssrRenderComponent(unref(SelectItemIndicator), { "as-child": "" }, {
                                              default: withCtx((_5, _push7, _parent7, _scopeId6) => {
                                                var _a8, _b6, _c4, _d4;
                                                if (_push7) {
                                                  _push7(ssrRenderComponent(_sfc_main$4, {
                                                    name: __props.selectedIcon || unref(appConfig2).ui.icons.check,
                                                    "data-slot": "itemTrailingIcon",
                                                    class: ui.value.itemTrailingIcon({ class: [(_a8 = props.ui) == null ? void 0 : _a8.itemTrailingIcon, isSelectItem(item) && ((_b6 = item.ui) == null ? void 0 : _b6.itemTrailingIcon)] })
                                                  }, null, _parent7, _scopeId6));
                                                } else {
                                                  return [
                                                    createVNode(_sfc_main$4, {
                                                      name: __props.selectedIcon || unref(appConfig2).ui.icons.check,
                                                      "data-slot": "itemTrailingIcon",
                                                      class: ui.value.itemTrailingIcon({ class: [(_c4 = props.ui) == null ? void 0 : _c4.itemTrailingIcon, isSelectItem(item) && ((_d4 = item.ui) == null ? void 0 : _d4.itemTrailingIcon)] })
                                                    }, null, 8, ["name", "class"])
                                                  ];
                                                }
                                              }),
                                              _: 2
                                            }, _parent6, _scopeId5));
                                            _push6(`</span>`);
                                          }, _push6, _parent6, _scopeId5);
                                        } else {
                                          return [
                                            renderSlot(_ctx.$slots, "item", {
                                              item,
                                              index,
                                              ui: ui.value
                                            }, () => {
                                              var _a7, _b5, _c3, _d3, _e2, _f2, _g, _h;
                                              return [
                                                renderSlot(_ctx.$slots, "item-leading", {
                                                  item,
                                                  index,
                                                  ui: ui.value
                                                }, () => {
                                                  var _a8, _b6, _c4, _d4, _e3, _f3, _g2, _h2, _i, _j;
                                                  return [
                                                    isSelectItem(item) && item.icon ? (openBlock(), createBlock(_sfc_main$4, {
                                                      key: 0,
                                                      name: item.icon,
                                                      "data-slot": "itemLeadingIcon",
                                                      class: ui.value.itemLeadingIcon({ class: [(_a8 = props.ui) == null ? void 0 : _a8.itemLeadingIcon, (_b6 = item.ui) == null ? void 0 : _b6.itemLeadingIcon] })
                                                    }, null, 8, ["name", "class"])) : isSelectItem(item) && item.avatar ? (openBlock(), createBlock(_sfc_main$2, mergeProps({
                                                      key: 1,
                                                      size: ((_c4 = item.ui) == null ? void 0 : _c4.itemLeadingAvatarSize) || ((_d4 = props.ui) == null ? void 0 : _d4.itemLeadingAvatarSize) || ui.value.itemLeadingAvatarSize()
                                                    }, { ref_for: true }, item.avatar, {
                                                      "data-slot": "itemLeadingAvatar",
                                                      class: ui.value.itemLeadingAvatar({ class: [(_e3 = props.ui) == null ? void 0 : _e3.itemLeadingAvatar, (_f3 = item.ui) == null ? void 0 : _f3.itemLeadingAvatar] })
                                                    }), null, 16, ["size", "class"])) : isSelectItem(item) && item.chip ? (openBlock(), createBlock(_sfc_main$3, mergeProps({
                                                      key: 2,
                                                      size: ((_g2 = item.ui) == null ? void 0 : _g2.itemLeadingChipSize) || ((_h2 = props.ui) == null ? void 0 : _h2.itemLeadingChipSize) || ui.value.itemLeadingChipSize(),
                                                      inset: "",
                                                      standalone: ""
                                                    }, { ref_for: true }, item.chip, {
                                                      "data-slot": "itemLeadingChip",
                                                      class: ui.value.itemLeadingChip({ class: [(_i = props.ui) == null ? void 0 : _i.itemLeadingChip, (_j = item.ui) == null ? void 0 : _j.itemLeadingChip] })
                                                    }), null, 16, ["size", "class"])) : createCommentVNode("", true)
                                                  ];
                                                }),
                                                createVNode("span", {
                                                  "data-slot": "itemWrapper",
                                                  class: ui.value.itemWrapper({ class: [(_a7 = props.ui) == null ? void 0 : _a7.itemWrapper, isSelectItem(item) && ((_b5 = item.ui) == null ? void 0 : _b5.itemWrapper)] })
                                                }, [
                                                  createVNode(unref(SelectItemText), {
                                                    "data-slot": "itemLabel",
                                                    class: ui.value.itemLabel({ class: [(_c3 = props.ui) == null ? void 0 : _c3.itemLabel, isSelectItem(item) && ((_d3 = item.ui) == null ? void 0 : _d3.itemLabel)] })
                                                  }, {
                                                    default: withCtx(() => [
                                                      renderSlot(_ctx.$slots, "item-label", {
                                                        item,
                                                        index
                                                      }, () => [
                                                        createTextVNode(toDisplayString(isSelectItem(item) ? unref(get)(item, props.labelKey) : item), 1)
                                                      ])
                                                    ]),
                                                    _: 2
                                                  }, 1032, ["class"]),
                                                  isSelectItem(item) && (unref(get)(item, props.descriptionKey) || !!slots["item-description"]) ? (openBlock(), createBlock("span", {
                                                    key: 0,
                                                    "data-slot": "itemDescription",
                                                    class: ui.value.itemDescription({ class: [(_e2 = props.ui) == null ? void 0 : _e2.itemDescription, isSelectItem(item) && ((_f2 = item.ui) == null ? void 0 : _f2.itemDescription)] })
                                                  }, [
                                                    renderSlot(_ctx.$slots, "item-description", {
                                                      item,
                                                      index
                                                    }, () => [
                                                      createTextVNode(toDisplayString(unref(get)(item, props.descriptionKey)), 1)
                                                    ])
                                                  ], 2)) : createCommentVNode("", true)
                                                ], 2),
                                                createVNode("span", {
                                                  "data-slot": "itemTrailing",
                                                  class: ui.value.itemTrailing({ class: [(_g = props.ui) == null ? void 0 : _g.itemTrailing, isSelectItem(item) && ((_h = item.ui) == null ? void 0 : _h.itemTrailing)] })
                                                }, [
                                                  renderSlot(_ctx.$slots, "item-trailing", {
                                                    item,
                                                    index,
                                                    ui: ui.value
                                                  }),
                                                  createVNode(unref(SelectItemIndicator), { "as-child": "" }, {
                                                    default: withCtx(() => {
                                                      var _a8, _b6;
                                                      return [
                                                        createVNode(_sfc_main$4, {
                                                          name: __props.selectedIcon || unref(appConfig2).ui.icons.check,
                                                          "data-slot": "itemTrailingIcon",
                                                          class: ui.value.itemTrailingIcon({ class: [(_a8 = props.ui) == null ? void 0 : _a8.itemTrailingIcon, isSelectItem(item) && ((_b6 = item.ui) == null ? void 0 : _b6.itemTrailingIcon)] })
                                                        }, null, 8, ["name", "class"])
                                                      ];
                                                    }),
                                                    _: 2
                                                  }, 1024)
                                                ], 2)
                                              ];
                                            })
                                          ];
                                        }
                                      }),
                                      _: 2
                                    }, _parent5, _scopeId4));
                                  }
                                  _push5(`<!--]-->`);
                                });
                                _push5(`<!--]-->`);
                              } else {
                                return [
                                  (openBlock(true), createBlock(Fragment, null, renderList(group, (item, index) => {
                                    var _a6, _b4, _c2, _d2, _e, _f;
                                    return openBlock(), createBlock(Fragment, {
                                      key: `group-${groupIndex}-${index}`
                                    }, [
                                      isSelectItem(item) && item.type === "label" ? (openBlock(), createBlock(unref(SelectLabel), {
                                        key: 0,
                                        "data-slot": "label",
                                        class: ui.value.label({ class: [(_a6 = props.ui) == null ? void 0 : _a6.label, (_b4 = item.ui) == null ? void 0 : _b4.label, item.class] })
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(unref(get)(item, props.labelKey)), 1)
                                        ]),
                                        _: 2
                                      }, 1032, ["class"])) : isSelectItem(item) && item.type === "separator" ? (openBlock(), createBlock(unref(SelectSeparator), {
                                        key: 1,
                                        "data-slot": "separator",
                                        class: ui.value.separator({ class: [(_c2 = props.ui) == null ? void 0 : _c2.separator, (_d2 = item.ui) == null ? void 0 : _d2.separator, item.class] })
                                      }, null, 8, ["class"])) : (openBlock(), createBlock(unref(SelectItem), {
                                        key: 2,
                                        "data-slot": "item",
                                        class: ui.value.item({ class: [(_e = props.ui) == null ? void 0 : _e.item, isSelectItem(item) && ((_f = item.ui) == null ? void 0 : _f.item), isSelectItem(item) && item.class] }),
                                        disabled: isSelectItem(item) && item.disabled,
                                        value: isSelectItem(item) ? unref(get)(item, props.valueKey) : item,
                                        onSelect: ($event) => {
                                          var _a7;
                                          return isSelectItem(item) && ((_a7 = item.onSelect) == null ? void 0 : _a7.call(item, $event));
                                        }
                                      }, {
                                        default: withCtx(() => [
                                          renderSlot(_ctx.$slots, "item", {
                                            item,
                                            index,
                                            ui: ui.value
                                          }, () => {
                                            var _a7, _b5, _c3, _d3, _e2, _f2, _g, _h;
                                            return [
                                              renderSlot(_ctx.$slots, "item-leading", {
                                                item,
                                                index,
                                                ui: ui.value
                                              }, () => {
                                                var _a8, _b6, _c4, _d4, _e3, _f3, _g2, _h2, _i, _j;
                                                return [
                                                  isSelectItem(item) && item.icon ? (openBlock(), createBlock(_sfc_main$4, {
                                                    key: 0,
                                                    name: item.icon,
                                                    "data-slot": "itemLeadingIcon",
                                                    class: ui.value.itemLeadingIcon({ class: [(_a8 = props.ui) == null ? void 0 : _a8.itemLeadingIcon, (_b6 = item.ui) == null ? void 0 : _b6.itemLeadingIcon] })
                                                  }, null, 8, ["name", "class"])) : isSelectItem(item) && item.avatar ? (openBlock(), createBlock(_sfc_main$2, mergeProps({
                                                    key: 1,
                                                    size: ((_c4 = item.ui) == null ? void 0 : _c4.itemLeadingAvatarSize) || ((_d4 = props.ui) == null ? void 0 : _d4.itemLeadingAvatarSize) || ui.value.itemLeadingAvatarSize()
                                                  }, { ref_for: true }, item.avatar, {
                                                    "data-slot": "itemLeadingAvatar",
                                                    class: ui.value.itemLeadingAvatar({ class: [(_e3 = props.ui) == null ? void 0 : _e3.itemLeadingAvatar, (_f3 = item.ui) == null ? void 0 : _f3.itemLeadingAvatar] })
                                                  }), null, 16, ["size", "class"])) : isSelectItem(item) && item.chip ? (openBlock(), createBlock(_sfc_main$3, mergeProps({
                                                    key: 2,
                                                    size: ((_g2 = item.ui) == null ? void 0 : _g2.itemLeadingChipSize) || ((_h2 = props.ui) == null ? void 0 : _h2.itemLeadingChipSize) || ui.value.itemLeadingChipSize(),
                                                    inset: "",
                                                    standalone: ""
                                                  }, { ref_for: true }, item.chip, {
                                                    "data-slot": "itemLeadingChip",
                                                    class: ui.value.itemLeadingChip({ class: [(_i = props.ui) == null ? void 0 : _i.itemLeadingChip, (_j = item.ui) == null ? void 0 : _j.itemLeadingChip] })
                                                  }), null, 16, ["size", "class"])) : createCommentVNode("", true)
                                                ];
                                              }),
                                              createVNode("span", {
                                                "data-slot": "itemWrapper",
                                                class: ui.value.itemWrapper({ class: [(_a7 = props.ui) == null ? void 0 : _a7.itemWrapper, isSelectItem(item) && ((_b5 = item.ui) == null ? void 0 : _b5.itemWrapper)] })
                                              }, [
                                                createVNode(unref(SelectItemText), {
                                                  "data-slot": "itemLabel",
                                                  class: ui.value.itemLabel({ class: [(_c3 = props.ui) == null ? void 0 : _c3.itemLabel, isSelectItem(item) && ((_d3 = item.ui) == null ? void 0 : _d3.itemLabel)] })
                                                }, {
                                                  default: withCtx(() => [
                                                    renderSlot(_ctx.$slots, "item-label", {
                                                      item,
                                                      index
                                                    }, () => [
                                                      createTextVNode(toDisplayString(isSelectItem(item) ? unref(get)(item, props.labelKey) : item), 1)
                                                    ])
                                                  ]),
                                                  _: 2
                                                }, 1032, ["class"]),
                                                isSelectItem(item) && (unref(get)(item, props.descriptionKey) || !!slots["item-description"]) ? (openBlock(), createBlock("span", {
                                                  key: 0,
                                                  "data-slot": "itemDescription",
                                                  class: ui.value.itemDescription({ class: [(_e2 = props.ui) == null ? void 0 : _e2.itemDescription, isSelectItem(item) && ((_f2 = item.ui) == null ? void 0 : _f2.itemDescription)] })
                                                }, [
                                                  renderSlot(_ctx.$slots, "item-description", {
                                                    item,
                                                    index
                                                  }, () => [
                                                    createTextVNode(toDisplayString(unref(get)(item, props.descriptionKey)), 1)
                                                  ])
                                                ], 2)) : createCommentVNode("", true)
                                              ], 2),
                                              createVNode("span", {
                                                "data-slot": "itemTrailing",
                                                class: ui.value.itemTrailing({ class: [(_g = props.ui) == null ? void 0 : _g.itemTrailing, isSelectItem(item) && ((_h = item.ui) == null ? void 0 : _h.itemTrailing)] })
                                              }, [
                                                renderSlot(_ctx.$slots, "item-trailing", {
                                                  item,
                                                  index,
                                                  ui: ui.value
                                                }),
                                                createVNode(unref(SelectItemIndicator), { "as-child": "" }, {
                                                  default: withCtx(() => {
                                                    var _a8, _b6;
                                                    return [
                                                      createVNode(_sfc_main$4, {
                                                        name: __props.selectedIcon || unref(appConfig2).ui.icons.check,
                                                        "data-slot": "itemTrailingIcon",
                                                        class: ui.value.itemTrailingIcon({ class: [(_a8 = props.ui) == null ? void 0 : _a8.itemTrailingIcon, isSelectItem(item) && ((_b6 = item.ui) == null ? void 0 : _b6.itemTrailingIcon)] })
                                                      }, null, 8, ["name", "class"])
                                                    ];
                                                  }),
                                                  _: 2
                                                }, 1024)
                                              ], 2)
                                            ];
                                          })
                                        ]),
                                        _: 2
                                      }, 1032, ["class", "disabled", "value", "onSelect"]))
                                    ], 64);
                                  }), 128))
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                        });
                        _push4(`<!--]--></div>`);
                        ssrRenderSlot(_ctx.$slots, "content-bottom", {}, null, _push4, _parent4, _scopeId3);
                        if (!!__props.arrow) {
                          _push4(ssrRenderComponent(unref(SelectArrow), mergeProps(arrowProps.value, {
                            "data-slot": "arrow",
                            class: ui.value.arrow({ class: (_b3 = props.ui) == null ? void 0 : _b3.arrow })
                          }), null, _parent4, _scopeId3));
                        } else {
                          _push4(`<!---->`);
                        }
                      } else {
                        return [
                          renderSlot(_ctx.$slots, "content-top"),
                          createVNode("div", {
                            ref_key: "viewportRef",
                            ref: viewportRef,
                            role: "presentation",
                            "data-slot": "viewport",
                            class: ui.value.viewport({ class: (_c = props.ui) == null ? void 0 : _c.viewport })
                          }, [
                            (openBlock(true), createBlock(Fragment, null, renderList(groups.value, (group, groupIndex) => {
                              var _a5;
                              return openBlock(), createBlock(unref(SelectGroup), {
                                key: `group-${groupIndex}`,
                                "data-slot": "group",
                                class: ui.value.group({ class: (_a5 = props.ui) == null ? void 0 : _a5.group })
                              }, {
                                default: withCtx(() => [
                                  (openBlock(true), createBlock(Fragment, null, renderList(group, (item, index) => {
                                    var _a6, _b4, _c2, _d2, _e, _f;
                                    return openBlock(), createBlock(Fragment, {
                                      key: `group-${groupIndex}-${index}`
                                    }, [
                                      isSelectItem(item) && item.type === "label" ? (openBlock(), createBlock(unref(SelectLabel), {
                                        key: 0,
                                        "data-slot": "label",
                                        class: ui.value.label({ class: [(_a6 = props.ui) == null ? void 0 : _a6.label, (_b4 = item.ui) == null ? void 0 : _b4.label, item.class] })
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(unref(get)(item, props.labelKey)), 1)
                                        ]),
                                        _: 2
                                      }, 1032, ["class"])) : isSelectItem(item) && item.type === "separator" ? (openBlock(), createBlock(unref(SelectSeparator), {
                                        key: 1,
                                        "data-slot": "separator",
                                        class: ui.value.separator({ class: [(_c2 = props.ui) == null ? void 0 : _c2.separator, (_d2 = item.ui) == null ? void 0 : _d2.separator, item.class] })
                                      }, null, 8, ["class"])) : (openBlock(), createBlock(unref(SelectItem), {
                                        key: 2,
                                        "data-slot": "item",
                                        class: ui.value.item({ class: [(_e = props.ui) == null ? void 0 : _e.item, isSelectItem(item) && ((_f = item.ui) == null ? void 0 : _f.item), isSelectItem(item) && item.class] }),
                                        disabled: isSelectItem(item) && item.disabled,
                                        value: isSelectItem(item) ? unref(get)(item, props.valueKey) : item,
                                        onSelect: ($event) => {
                                          var _a7;
                                          return isSelectItem(item) && ((_a7 = item.onSelect) == null ? void 0 : _a7.call(item, $event));
                                        }
                                      }, {
                                        default: withCtx(() => [
                                          renderSlot(_ctx.$slots, "item", {
                                            item,
                                            index,
                                            ui: ui.value
                                          }, () => {
                                            var _a7, _b5, _c3, _d3, _e2, _f2, _g, _h;
                                            return [
                                              renderSlot(_ctx.$slots, "item-leading", {
                                                item,
                                                index,
                                                ui: ui.value
                                              }, () => {
                                                var _a8, _b6, _c4, _d4, _e3, _f3, _g2, _h2, _i, _j;
                                                return [
                                                  isSelectItem(item) && item.icon ? (openBlock(), createBlock(_sfc_main$4, {
                                                    key: 0,
                                                    name: item.icon,
                                                    "data-slot": "itemLeadingIcon",
                                                    class: ui.value.itemLeadingIcon({ class: [(_a8 = props.ui) == null ? void 0 : _a8.itemLeadingIcon, (_b6 = item.ui) == null ? void 0 : _b6.itemLeadingIcon] })
                                                  }, null, 8, ["name", "class"])) : isSelectItem(item) && item.avatar ? (openBlock(), createBlock(_sfc_main$2, mergeProps({
                                                    key: 1,
                                                    size: ((_c4 = item.ui) == null ? void 0 : _c4.itemLeadingAvatarSize) || ((_d4 = props.ui) == null ? void 0 : _d4.itemLeadingAvatarSize) || ui.value.itemLeadingAvatarSize()
                                                  }, { ref_for: true }, item.avatar, {
                                                    "data-slot": "itemLeadingAvatar",
                                                    class: ui.value.itemLeadingAvatar({ class: [(_e3 = props.ui) == null ? void 0 : _e3.itemLeadingAvatar, (_f3 = item.ui) == null ? void 0 : _f3.itemLeadingAvatar] })
                                                  }), null, 16, ["size", "class"])) : isSelectItem(item) && item.chip ? (openBlock(), createBlock(_sfc_main$3, mergeProps({
                                                    key: 2,
                                                    size: ((_g2 = item.ui) == null ? void 0 : _g2.itemLeadingChipSize) || ((_h2 = props.ui) == null ? void 0 : _h2.itemLeadingChipSize) || ui.value.itemLeadingChipSize(),
                                                    inset: "",
                                                    standalone: ""
                                                  }, { ref_for: true }, item.chip, {
                                                    "data-slot": "itemLeadingChip",
                                                    class: ui.value.itemLeadingChip({ class: [(_i = props.ui) == null ? void 0 : _i.itemLeadingChip, (_j = item.ui) == null ? void 0 : _j.itemLeadingChip] })
                                                  }), null, 16, ["size", "class"])) : createCommentVNode("", true)
                                                ];
                                              }),
                                              createVNode("span", {
                                                "data-slot": "itemWrapper",
                                                class: ui.value.itemWrapper({ class: [(_a7 = props.ui) == null ? void 0 : _a7.itemWrapper, isSelectItem(item) && ((_b5 = item.ui) == null ? void 0 : _b5.itemWrapper)] })
                                              }, [
                                                createVNode(unref(SelectItemText), {
                                                  "data-slot": "itemLabel",
                                                  class: ui.value.itemLabel({ class: [(_c3 = props.ui) == null ? void 0 : _c3.itemLabel, isSelectItem(item) && ((_d3 = item.ui) == null ? void 0 : _d3.itemLabel)] })
                                                }, {
                                                  default: withCtx(() => [
                                                    renderSlot(_ctx.$slots, "item-label", {
                                                      item,
                                                      index
                                                    }, () => [
                                                      createTextVNode(toDisplayString(isSelectItem(item) ? unref(get)(item, props.labelKey) : item), 1)
                                                    ])
                                                  ]),
                                                  _: 2
                                                }, 1032, ["class"]),
                                                isSelectItem(item) && (unref(get)(item, props.descriptionKey) || !!slots["item-description"]) ? (openBlock(), createBlock("span", {
                                                  key: 0,
                                                  "data-slot": "itemDescription",
                                                  class: ui.value.itemDescription({ class: [(_e2 = props.ui) == null ? void 0 : _e2.itemDescription, isSelectItem(item) && ((_f2 = item.ui) == null ? void 0 : _f2.itemDescription)] })
                                                }, [
                                                  renderSlot(_ctx.$slots, "item-description", {
                                                    item,
                                                    index
                                                  }, () => [
                                                    createTextVNode(toDisplayString(unref(get)(item, props.descriptionKey)), 1)
                                                  ])
                                                ], 2)) : createCommentVNode("", true)
                                              ], 2),
                                              createVNode("span", {
                                                "data-slot": "itemTrailing",
                                                class: ui.value.itemTrailing({ class: [(_g = props.ui) == null ? void 0 : _g.itemTrailing, isSelectItem(item) && ((_h = item.ui) == null ? void 0 : _h.itemTrailing)] })
                                              }, [
                                                renderSlot(_ctx.$slots, "item-trailing", {
                                                  item,
                                                  index,
                                                  ui: ui.value
                                                }),
                                                createVNode(unref(SelectItemIndicator), { "as-child": "" }, {
                                                  default: withCtx(() => {
                                                    var _a8, _b6;
                                                    return [
                                                      createVNode(_sfc_main$4, {
                                                        name: __props.selectedIcon || unref(appConfig2).ui.icons.check,
                                                        "data-slot": "itemTrailingIcon",
                                                        class: ui.value.itemTrailingIcon({ class: [(_a8 = props.ui) == null ? void 0 : _a8.itemTrailingIcon, isSelectItem(item) && ((_b6 = item.ui) == null ? void 0 : _b6.itemTrailingIcon)] })
                                                      }, null, 8, ["name", "class"])
                                                    ];
                                                  }),
                                                  _: 2
                                                }, 1024)
                                              ], 2)
                                            ];
                                          })
                                        ]),
                                        _: 2
                                      }, 1032, ["class", "disabled", "value", "onSelect"]))
                                    ], 64);
                                  }), 128))
                                ]),
                                _: 2
                              }, 1032, ["class"]);
                            }), 128))
                          ], 2),
                          renderSlot(_ctx.$slots, "content-bottom"),
                          !!__props.arrow ? (openBlock(), createBlock(unref(SelectArrow), mergeProps({ key: 0 }, arrowProps.value, {
                            "data-slot": "arrow",
                            class: ui.value.arrow({ class: (_d = props.ui) == null ? void 0 : _d.arrow })
                          }), null, 16, ["class"])) : createCommentVNode("", true)
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(SelectContent), mergeProps({
                      "data-slot": "content",
                      class: ui.value.content({ class: (_b2 = props.ui) == null ? void 0 : _b2.content })
                    }, contentProps.value), {
                      default: withCtx(() => {
                        var _a4, _b3;
                        return [
                          renderSlot(_ctx.$slots, "content-top"),
                          createVNode("div", {
                            ref_key: "viewportRef",
                            ref: viewportRef,
                            role: "presentation",
                            "data-slot": "viewport",
                            class: ui.value.viewport({ class: (_a4 = props.ui) == null ? void 0 : _a4.viewport })
                          }, [
                            (openBlock(true), createBlock(Fragment, null, renderList(groups.value, (group, groupIndex) => {
                              var _a5;
                              return openBlock(), createBlock(unref(SelectGroup), {
                                key: `group-${groupIndex}`,
                                "data-slot": "group",
                                class: ui.value.group({ class: (_a5 = props.ui) == null ? void 0 : _a5.group })
                              }, {
                                default: withCtx(() => [
                                  (openBlock(true), createBlock(Fragment, null, renderList(group, (item, index) => {
                                    var _a6, _b4, _c, _d, _e, _f;
                                    return openBlock(), createBlock(Fragment, {
                                      key: `group-${groupIndex}-${index}`
                                    }, [
                                      isSelectItem(item) && item.type === "label" ? (openBlock(), createBlock(unref(SelectLabel), {
                                        key: 0,
                                        "data-slot": "label",
                                        class: ui.value.label({ class: [(_a6 = props.ui) == null ? void 0 : _a6.label, (_b4 = item.ui) == null ? void 0 : _b4.label, item.class] })
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(unref(get)(item, props.labelKey)), 1)
                                        ]),
                                        _: 2
                                      }, 1032, ["class"])) : isSelectItem(item) && item.type === "separator" ? (openBlock(), createBlock(unref(SelectSeparator), {
                                        key: 1,
                                        "data-slot": "separator",
                                        class: ui.value.separator({ class: [(_c = props.ui) == null ? void 0 : _c.separator, (_d = item.ui) == null ? void 0 : _d.separator, item.class] })
                                      }, null, 8, ["class"])) : (openBlock(), createBlock(unref(SelectItem), {
                                        key: 2,
                                        "data-slot": "item",
                                        class: ui.value.item({ class: [(_e = props.ui) == null ? void 0 : _e.item, isSelectItem(item) && ((_f = item.ui) == null ? void 0 : _f.item), isSelectItem(item) && item.class] }),
                                        disabled: isSelectItem(item) && item.disabled,
                                        value: isSelectItem(item) ? unref(get)(item, props.valueKey) : item,
                                        onSelect: ($event) => {
                                          var _a7;
                                          return isSelectItem(item) && ((_a7 = item.onSelect) == null ? void 0 : _a7.call(item, $event));
                                        }
                                      }, {
                                        default: withCtx(() => [
                                          renderSlot(_ctx.$slots, "item", {
                                            item,
                                            index,
                                            ui: ui.value
                                          }, () => {
                                            var _a7, _b5, _c2, _d2, _e2, _f2, _g, _h;
                                            return [
                                              renderSlot(_ctx.$slots, "item-leading", {
                                                item,
                                                index,
                                                ui: ui.value
                                              }, () => {
                                                var _a8, _b6, _c3, _d3, _e3, _f3, _g2, _h2, _i, _j;
                                                return [
                                                  isSelectItem(item) && item.icon ? (openBlock(), createBlock(_sfc_main$4, {
                                                    key: 0,
                                                    name: item.icon,
                                                    "data-slot": "itemLeadingIcon",
                                                    class: ui.value.itemLeadingIcon({ class: [(_a8 = props.ui) == null ? void 0 : _a8.itemLeadingIcon, (_b6 = item.ui) == null ? void 0 : _b6.itemLeadingIcon] })
                                                  }, null, 8, ["name", "class"])) : isSelectItem(item) && item.avatar ? (openBlock(), createBlock(_sfc_main$2, mergeProps({
                                                    key: 1,
                                                    size: ((_c3 = item.ui) == null ? void 0 : _c3.itemLeadingAvatarSize) || ((_d3 = props.ui) == null ? void 0 : _d3.itemLeadingAvatarSize) || ui.value.itemLeadingAvatarSize()
                                                  }, { ref_for: true }, item.avatar, {
                                                    "data-slot": "itemLeadingAvatar",
                                                    class: ui.value.itemLeadingAvatar({ class: [(_e3 = props.ui) == null ? void 0 : _e3.itemLeadingAvatar, (_f3 = item.ui) == null ? void 0 : _f3.itemLeadingAvatar] })
                                                  }), null, 16, ["size", "class"])) : isSelectItem(item) && item.chip ? (openBlock(), createBlock(_sfc_main$3, mergeProps({
                                                    key: 2,
                                                    size: ((_g2 = item.ui) == null ? void 0 : _g2.itemLeadingChipSize) || ((_h2 = props.ui) == null ? void 0 : _h2.itemLeadingChipSize) || ui.value.itemLeadingChipSize(),
                                                    inset: "",
                                                    standalone: ""
                                                  }, { ref_for: true }, item.chip, {
                                                    "data-slot": "itemLeadingChip",
                                                    class: ui.value.itemLeadingChip({ class: [(_i = props.ui) == null ? void 0 : _i.itemLeadingChip, (_j = item.ui) == null ? void 0 : _j.itemLeadingChip] })
                                                  }), null, 16, ["size", "class"])) : createCommentVNode("", true)
                                                ];
                                              }),
                                              createVNode("span", {
                                                "data-slot": "itemWrapper",
                                                class: ui.value.itemWrapper({ class: [(_a7 = props.ui) == null ? void 0 : _a7.itemWrapper, isSelectItem(item) && ((_b5 = item.ui) == null ? void 0 : _b5.itemWrapper)] })
                                              }, [
                                                createVNode(unref(SelectItemText), {
                                                  "data-slot": "itemLabel",
                                                  class: ui.value.itemLabel({ class: [(_c2 = props.ui) == null ? void 0 : _c2.itemLabel, isSelectItem(item) && ((_d2 = item.ui) == null ? void 0 : _d2.itemLabel)] })
                                                }, {
                                                  default: withCtx(() => [
                                                    renderSlot(_ctx.$slots, "item-label", {
                                                      item,
                                                      index
                                                    }, () => [
                                                      createTextVNode(toDisplayString(isSelectItem(item) ? unref(get)(item, props.labelKey) : item), 1)
                                                    ])
                                                  ]),
                                                  _: 2
                                                }, 1032, ["class"]),
                                                isSelectItem(item) && (unref(get)(item, props.descriptionKey) || !!slots["item-description"]) ? (openBlock(), createBlock("span", {
                                                  key: 0,
                                                  "data-slot": "itemDescription",
                                                  class: ui.value.itemDescription({ class: [(_e2 = props.ui) == null ? void 0 : _e2.itemDescription, isSelectItem(item) && ((_f2 = item.ui) == null ? void 0 : _f2.itemDescription)] })
                                                }, [
                                                  renderSlot(_ctx.$slots, "item-description", {
                                                    item,
                                                    index
                                                  }, () => [
                                                    createTextVNode(toDisplayString(unref(get)(item, props.descriptionKey)), 1)
                                                  ])
                                                ], 2)) : createCommentVNode("", true)
                                              ], 2),
                                              createVNode("span", {
                                                "data-slot": "itemTrailing",
                                                class: ui.value.itemTrailing({ class: [(_g = props.ui) == null ? void 0 : _g.itemTrailing, isSelectItem(item) && ((_h = item.ui) == null ? void 0 : _h.itemTrailing)] })
                                              }, [
                                                renderSlot(_ctx.$slots, "item-trailing", {
                                                  item,
                                                  index,
                                                  ui: ui.value
                                                }),
                                                createVNode(unref(SelectItemIndicator), { "as-child": "" }, {
                                                  default: withCtx(() => {
                                                    var _a8, _b6;
                                                    return [
                                                      createVNode(_sfc_main$4, {
                                                        name: __props.selectedIcon || unref(appConfig2).ui.icons.check,
                                                        "data-slot": "itemTrailingIcon",
                                                        class: ui.value.itemTrailingIcon({ class: [(_a8 = props.ui) == null ? void 0 : _a8.itemTrailingIcon, isSelectItem(item) && ((_b6 = item.ui) == null ? void 0 : _b6.itemTrailingIcon)] })
                                                      }, null, 8, ["name", "class"])
                                                    ];
                                                  }),
                                                  _: 2
                                                }, 1024)
                                              ], 2)
                                            ];
                                          })
                                        ]),
                                        _: 2
                                      }, 1032, ["class", "disabled", "value", "onSelect"]))
                                    ], 64);
                                  }), 128))
                                ]),
                                _: 2
                              }, 1032, ["class"]);
                            }), 128))
                          ], 2),
                          renderSlot(_ctx.$slots, "content-bottom"),
                          !!__props.arrow ? (openBlock(), createBlock(unref(SelectArrow), mergeProps({ key: 0 }, arrowProps.value, {
                            "data-slot": "arrow",
                            class: ui.value.arrow({ class: (_b3 = props.ui) == null ? void 0 : _b3.arrow })
                          }), null, 16, ["class"])) : createCommentVNode("", true)
                        ];
                      }),
                      _: 3
                    }, 16, ["class"])
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(SelectTrigger), mergeProps({
                id: unref(id),
                ref_key: "triggerRef",
                ref: triggerRef,
                "data-slot": "base",
                class: ui.value.base({ class: [(_b = props.ui) == null ? void 0 : _b.base, props.class] })
              }, { ..._ctx.$attrs, ...unref(ariaAttrs) }), {
                default: withCtx(() => {
                  var _a3, _b2;
                  return [
                    unref(isLeading) || !!__props.avatar || !!slots.leading ? (openBlock(), createBlock("span", {
                      key: 0,
                      "data-slot": "leading",
                      class: ui.value.leading({ class: (_a3 = props.ui) == null ? void 0 : _a3.leading })
                    }, [
                      renderSlot(_ctx.$slots, "leading", {
                        modelValue,
                        open,
                        ui: ui.value
                      }, () => {
                        var _a4, _b3, _c;
                        return [
                          unref(isLeading) && unref(leadingIconName) ? (openBlock(), createBlock(_sfc_main$4, {
                            key: 0,
                            name: unref(leadingIconName),
                            "data-slot": "leadingIcon",
                            class: ui.value.leadingIcon({ class: (_a4 = props.ui) == null ? void 0 : _a4.leadingIcon })
                          }, null, 8, ["name", "class"])) : !!__props.avatar ? (openBlock(), createBlock(_sfc_main$2, mergeProps({
                            key: 1,
                            size: ((_b3 = props.ui) == null ? void 0 : _b3.itemLeadingAvatarSize) || ui.value.itemLeadingAvatarSize()
                          }, __props.avatar, {
                            "data-slot": "itemLeadingAvatar",
                            class: ui.value.itemLeadingAvatar({ class: (_c = props.ui) == null ? void 0 : _c.itemLeadingAvatar })
                          }), null, 16, ["size", "class"])) : createCommentVNode("", true)
                        ];
                      })
                    ], 2)) : createCommentVNode("", true),
                    renderSlot(_ctx.$slots, "default", {
                      modelValue,
                      open,
                      ui: ui.value
                    }, () => [
                      (openBlock(true), createBlock(Fragment, null, renderList([displayValue(modelValue)], (displayedModelValue) => {
                        var _a4, _b3, _c;
                        return openBlock(), createBlock(Fragment, { key: displayedModelValue }, [
                          displayedModelValue !== void 0 && displayedModelValue !== null ? (openBlock(), createBlock("span", {
                            key: 0,
                            "data-slot": "value",
                            class: ui.value.value({ class: (_a4 = props.ui) == null ? void 0 : _a4.value })
                          }, toDisplayString(displayedModelValue), 3)) : (openBlock(), createBlock("span", {
                            key: 1,
                            "data-slot": "placeholder",
                            class: ui.value.placeholder({ class: (_b3 = props.ui) == null ? void 0 : _b3.placeholder })
                          }, toDisplayString((_c = __props.placeholder) != null ? _c : "\xA0"), 3))
                        ], 64);
                      }), 128))
                    ]),
                    unref(isTrailing) || !!slots.trailing ? (openBlock(), createBlock("span", {
                      key: 1,
                      "data-slot": "trailing",
                      class: ui.value.trailing({ class: (_b2 = props.ui) == null ? void 0 : _b2.trailing })
                    }, [
                      renderSlot(_ctx.$slots, "trailing", {
                        modelValue,
                        open,
                        ui: ui.value
                      }, () => {
                        var _a4;
                        return [
                          unref(trailingIconName) ? (openBlock(), createBlock(_sfc_main$4, {
                            key: 0,
                            name: unref(trailingIconName),
                            "data-slot": "trailingIcon",
                            class: ui.value.trailingIcon({ class: (_a4 = props.ui) == null ? void 0 : _a4.trailingIcon })
                          }, null, 8, ["name", "class"])) : createCommentVNode("", true)
                        ];
                      })
                    ], 2)) : createCommentVNode("", true)
                  ];
                }),
                _: 2
              }, 1040, ["id", "class"]),
              createVNode(unref(SelectPortal), unref(portalProps), {
                default: withCtx(() => {
                  var _a3;
                  return [
                    createVNode(unref(SelectContent), mergeProps({
                      "data-slot": "content",
                      class: ui.value.content({ class: (_a3 = props.ui) == null ? void 0 : _a3.content })
                    }, contentProps.value), {
                      default: withCtx(() => {
                        var _a4, _b2;
                        return [
                          renderSlot(_ctx.$slots, "content-top"),
                          createVNode("div", {
                            ref_key: "viewportRef",
                            ref: viewportRef,
                            role: "presentation",
                            "data-slot": "viewport",
                            class: ui.value.viewport({ class: (_a4 = props.ui) == null ? void 0 : _a4.viewport })
                          }, [
                            (openBlock(true), createBlock(Fragment, null, renderList(groups.value, (group, groupIndex) => {
                              var _a5;
                              return openBlock(), createBlock(unref(SelectGroup), {
                                key: `group-${groupIndex}`,
                                "data-slot": "group",
                                class: ui.value.group({ class: (_a5 = props.ui) == null ? void 0 : _a5.group })
                              }, {
                                default: withCtx(() => [
                                  (openBlock(true), createBlock(Fragment, null, renderList(group, (item, index) => {
                                    var _a6, _b3, _c, _d, _e, _f;
                                    return openBlock(), createBlock(Fragment, {
                                      key: `group-${groupIndex}-${index}`
                                    }, [
                                      isSelectItem(item) && item.type === "label" ? (openBlock(), createBlock(unref(SelectLabel), {
                                        key: 0,
                                        "data-slot": "label",
                                        class: ui.value.label({ class: [(_a6 = props.ui) == null ? void 0 : _a6.label, (_b3 = item.ui) == null ? void 0 : _b3.label, item.class] })
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(unref(get)(item, props.labelKey)), 1)
                                        ]),
                                        _: 2
                                      }, 1032, ["class"])) : isSelectItem(item) && item.type === "separator" ? (openBlock(), createBlock(unref(SelectSeparator), {
                                        key: 1,
                                        "data-slot": "separator",
                                        class: ui.value.separator({ class: [(_c = props.ui) == null ? void 0 : _c.separator, (_d = item.ui) == null ? void 0 : _d.separator, item.class] })
                                      }, null, 8, ["class"])) : (openBlock(), createBlock(unref(SelectItem), {
                                        key: 2,
                                        "data-slot": "item",
                                        class: ui.value.item({ class: [(_e = props.ui) == null ? void 0 : _e.item, isSelectItem(item) && ((_f = item.ui) == null ? void 0 : _f.item), isSelectItem(item) && item.class] }),
                                        disabled: isSelectItem(item) && item.disabled,
                                        value: isSelectItem(item) ? unref(get)(item, props.valueKey) : item,
                                        onSelect: ($event) => {
                                          var _a7;
                                          return isSelectItem(item) && ((_a7 = item.onSelect) == null ? void 0 : _a7.call(item, $event));
                                        }
                                      }, {
                                        default: withCtx(() => [
                                          renderSlot(_ctx.$slots, "item", {
                                            item,
                                            index,
                                            ui: ui.value
                                          }, () => {
                                            var _a7, _b4, _c2, _d2, _e2, _f2, _g, _h;
                                            return [
                                              renderSlot(_ctx.$slots, "item-leading", {
                                                item,
                                                index,
                                                ui: ui.value
                                              }, () => {
                                                var _a8, _b5, _c3, _d3, _e3, _f3, _g2, _h2, _i, _j;
                                                return [
                                                  isSelectItem(item) && item.icon ? (openBlock(), createBlock(_sfc_main$4, {
                                                    key: 0,
                                                    name: item.icon,
                                                    "data-slot": "itemLeadingIcon",
                                                    class: ui.value.itemLeadingIcon({ class: [(_a8 = props.ui) == null ? void 0 : _a8.itemLeadingIcon, (_b5 = item.ui) == null ? void 0 : _b5.itemLeadingIcon] })
                                                  }, null, 8, ["name", "class"])) : isSelectItem(item) && item.avatar ? (openBlock(), createBlock(_sfc_main$2, mergeProps({
                                                    key: 1,
                                                    size: ((_c3 = item.ui) == null ? void 0 : _c3.itemLeadingAvatarSize) || ((_d3 = props.ui) == null ? void 0 : _d3.itemLeadingAvatarSize) || ui.value.itemLeadingAvatarSize()
                                                  }, { ref_for: true }, item.avatar, {
                                                    "data-slot": "itemLeadingAvatar",
                                                    class: ui.value.itemLeadingAvatar({ class: [(_e3 = props.ui) == null ? void 0 : _e3.itemLeadingAvatar, (_f3 = item.ui) == null ? void 0 : _f3.itemLeadingAvatar] })
                                                  }), null, 16, ["size", "class"])) : isSelectItem(item) && item.chip ? (openBlock(), createBlock(_sfc_main$3, mergeProps({
                                                    key: 2,
                                                    size: ((_g2 = item.ui) == null ? void 0 : _g2.itemLeadingChipSize) || ((_h2 = props.ui) == null ? void 0 : _h2.itemLeadingChipSize) || ui.value.itemLeadingChipSize(),
                                                    inset: "",
                                                    standalone: ""
                                                  }, { ref_for: true }, item.chip, {
                                                    "data-slot": "itemLeadingChip",
                                                    class: ui.value.itemLeadingChip({ class: [(_i = props.ui) == null ? void 0 : _i.itemLeadingChip, (_j = item.ui) == null ? void 0 : _j.itemLeadingChip] })
                                                  }), null, 16, ["size", "class"])) : createCommentVNode("", true)
                                                ];
                                              }),
                                              createVNode("span", {
                                                "data-slot": "itemWrapper",
                                                class: ui.value.itemWrapper({ class: [(_a7 = props.ui) == null ? void 0 : _a7.itemWrapper, isSelectItem(item) && ((_b4 = item.ui) == null ? void 0 : _b4.itemWrapper)] })
                                              }, [
                                                createVNode(unref(SelectItemText), {
                                                  "data-slot": "itemLabel",
                                                  class: ui.value.itemLabel({ class: [(_c2 = props.ui) == null ? void 0 : _c2.itemLabel, isSelectItem(item) && ((_d2 = item.ui) == null ? void 0 : _d2.itemLabel)] })
                                                }, {
                                                  default: withCtx(() => [
                                                    renderSlot(_ctx.$slots, "item-label", {
                                                      item,
                                                      index
                                                    }, () => [
                                                      createTextVNode(toDisplayString(isSelectItem(item) ? unref(get)(item, props.labelKey) : item), 1)
                                                    ])
                                                  ]),
                                                  _: 2
                                                }, 1032, ["class"]),
                                                isSelectItem(item) && (unref(get)(item, props.descriptionKey) || !!slots["item-description"]) ? (openBlock(), createBlock("span", {
                                                  key: 0,
                                                  "data-slot": "itemDescription",
                                                  class: ui.value.itemDescription({ class: [(_e2 = props.ui) == null ? void 0 : _e2.itemDescription, isSelectItem(item) && ((_f2 = item.ui) == null ? void 0 : _f2.itemDescription)] })
                                                }, [
                                                  renderSlot(_ctx.$slots, "item-description", {
                                                    item,
                                                    index
                                                  }, () => [
                                                    createTextVNode(toDisplayString(unref(get)(item, props.descriptionKey)), 1)
                                                  ])
                                                ], 2)) : createCommentVNode("", true)
                                              ], 2),
                                              createVNode("span", {
                                                "data-slot": "itemTrailing",
                                                class: ui.value.itemTrailing({ class: [(_g = props.ui) == null ? void 0 : _g.itemTrailing, isSelectItem(item) && ((_h = item.ui) == null ? void 0 : _h.itemTrailing)] })
                                              }, [
                                                renderSlot(_ctx.$slots, "item-trailing", {
                                                  item,
                                                  index,
                                                  ui: ui.value
                                                }),
                                                createVNode(unref(SelectItemIndicator), { "as-child": "" }, {
                                                  default: withCtx(() => {
                                                    var _a8, _b5;
                                                    return [
                                                      createVNode(_sfc_main$4, {
                                                        name: __props.selectedIcon || unref(appConfig2).ui.icons.check,
                                                        "data-slot": "itemTrailingIcon",
                                                        class: ui.value.itemTrailingIcon({ class: [(_a8 = props.ui) == null ? void 0 : _a8.itemTrailingIcon, isSelectItem(item) && ((_b5 = item.ui) == null ? void 0 : _b5.itemTrailingIcon)] })
                                                      }, null, 8, ["name", "class"])
                                                    ];
                                                  }),
                                                  _: 2
                                                }, 1024)
                                              ], 2)
                                            ];
                                          })
                                        ]),
                                        _: 2
                                      }, 1032, ["class", "disabled", "value", "onSelect"]))
                                    ], 64);
                                  }), 128))
                                ]),
                                _: 2
                              }, 1032, ["class"]);
                            }), 128))
                          ], 2),
                          renderSlot(_ctx.$slots, "content-bottom"),
                          !!__props.arrow ? (openBlock(), createBlock(unref(SelectArrow), mergeProps({ key: 0 }, arrowProps.value, {
                            "data-slot": "arrow",
                            class: ui.value.arrow({ class: (_b2 = props.ui) == null ? void 0 : _b2.arrow })
                          }), null, 16, ["class"])) : createCommentVNode("", true)
                        ];
                      }),
                      _: 3
                    }, 16, ["class"])
                  ];
                }),
                _: 3
              }, 16)
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/ui/dist/runtime/components/Select.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "absolute inset-0 flex items-center justify-center bg-white/60 z-50" }, _attrs))}><svg class="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Spinner.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_4 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]), { __name: "Spinner" });

export { _sfc_main$1 as _, __nuxt_component_4 as a };
//# sourceMappingURL=Spinner-DtjF66NT.mjs.map
