import { Ref } from "react";

export function mergeRefs<T>(...refs: (Ref<T> | undefined)[]) {
  return (node: T) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(node);
      } else if (ref && typeof ref === "object") {
        (ref as React.MutableRefObject<T>).current = node;
      }
    });
  };
}
