import __nuxt_component_0 from './index-iO1hbeZi.mjs';
import { mergeProps, unref, createVNode, resolveDynamicComponent, ref, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderVNode } from 'vue/server-renderer';
import { useForwardProps } from 'reka-ui';
import { reactivePick } from '@vueuse/core';

const _sfc_main = {
  __name: "UIcon",
  __ssrInlineRender: true,
  props: {
    name: { type: null, required: true },
    mode: { type: String, required: false },
    size: { type: [String, Number], required: false },
    customize: { type: Function, required: false }
  },
  setup(__props) {
    const props = __props;
    const iconProps = useForwardProps(reactivePick(props, "name", "mode", "size", "customize"));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_0;
      if (typeof __props.name === "string") {
        _push(ssrRenderComponent(_component_Icon, mergeProps(unref(iconProps), _attrs), null, _parent));
      } else {
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(__props.name), _attrs, null), _parent);
      }
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/ui/dist/runtime/components/Icon.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const loading = ref(false);
function useGlobalLoading() {
  function setLoading(v) {
    loading.value = v;
  }
  async function wrap(fn) {
    setLoading(true);
    try {
      return await fn();
    } finally {
      setLoading(false);
    }
  }
  return { loading, setLoading, wrap };
}

export { _sfc_main as _, useGlobalLoading as u };
//# sourceMappingURL=useGlobalLoading-FpTo0JxB.mjs.map
