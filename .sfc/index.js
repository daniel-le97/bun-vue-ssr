import {
Fragment,
computed,
createBaseVNode,
createElementBlock,
createVNode,
defineComponent,
openBlock,
popScopeId,
pushScopeId,
ref,
toDisplayString,
vModelText,
withDirectives
} from "./chunk-9d1b106114dbe478.js";

// /Users/daniel/homelab/GitHub/Bun/buns/components/HelloWorld.vue?type=script
var _hoisted_1 = { class: "green" };
var HelloWorld_default = {
  __name: "HelloWorld",
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
// components/HelloWorld.vue
var HelloWorld_default2 = HelloWorld_default;
HelloWorld_default.__scopeId = "data-v-76e4b5ae";

// /Users/daniel/homelab/GitHub/Bun/buns/pages/index.vue?type=script
var _withScopeId = (n) => (pushScopeId("data-v-373c4857"), n = n(), popScopeId(), n);
var _hoisted_12 = _withScopeId(() => createBaseVNode("footer", { class: "bg-dark text-light" }, " Made with \uD83D\uDC96 by daniel ", -1));
var pages_default = defineComponent({
  __name: "index",
  setup(__props) {
    const count = ref(0);
    const increment = () => {
      count.value += 1;
    };
    const countValue = computed(() => count.value);
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", null, [
        createBaseVNode("button", {
          onClick: increment,
          class: "bg-blue text-light blue"
        }, "Increment"),
        createBaseVNode("h3", null, toDisplayString(countValue.value) + " or " + toDisplayString(count.value), 1),
        createVNode(HelloWorld_default2),
        _hoisted_12
      ]);
    };
  }
});
// pages/index.vue
var pages_default2 = pages_default;
export {
  pages_default2 as default
};
