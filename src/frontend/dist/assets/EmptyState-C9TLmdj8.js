import { j as jsxRuntimeExports, B as Button, a as cn } from "./index-BB5MO6AH.js";
function EmptyState({
  icon,
  emoji,
  title,
  description,
  action,
  secondaryAction,
  className
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn(
        "flex flex-col items-center justify-center text-center py-16 px-6",
        className
      ),
      "data-ocid": "empty-state",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4", children: icon ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-full bg-muted flex items-center justify-center text-muted-foreground", children: icon }) : emoji ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-6xl select-none", children: emoji }) : null }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-xl text-foreground mb-2", children: title }),
        description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm leading-relaxed max-w-sm mb-6", children: description }),
        (action || secondaryAction) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [
          action && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: action.variant ?? "default",
              onClick: action.onClick,
              "data-ocid": "empty-state-cta",
              children: action.label
            }
          ),
          secondaryAction && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", onClick: secondaryAction.onClick, children: secondaryAction.label })
        ] })
      ]
    }
  );
}
export {
  EmptyState as E
};
