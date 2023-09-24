import {
Fragment,
createBaseVNode,
createElementBlock,
openBlock,
ref,
toDisplayString,
vModelText,
withDirectives
} from "../chunk-9d1b106114dbe478.js";

// /Users/daniel/homelab/GitHub/Bun/buns/pages/tests/index.vue?type=script
var _hoisted_1 = { class: "red" };
var tests_default = {
  __name: "index",
  setup(__props) {
    const msg = ref("Hello World!");
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [
        createBaseVNode("h1", _hoisted_1, toDisplayString(msg.value), 1),
        withDirectives(createBaseVNode("input", {
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => msg.value = $event)
        }, null, 512), [
          [vModelText, msg.value]
        ])
      ], 64);
    };
  }
};
// pages/tests/index.vue
var tests_default2 = tests_default;
tests_default.__scopeId = "data-v-19310029";
export {
  tests_default2 as default
};
