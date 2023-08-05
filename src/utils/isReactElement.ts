import React from "react";

export default function isReactElement(el: React.ReactNode): el is React.ReactElement {
  return !!el && typeof el !== "string" && typeof el !== "number" && typeof el !== "boolean" && "type" in el && "props" in el;
}
