import React from "react";

export const FrameLink = (props) => {
  const mainRoute = parent.window.common?.mainRoute || "";
  const { to: _, native: __, ...linkProps } = props;

  return (
    <a
      {...linkProps}
      href={`${props?.native ? mainRoute : ""}${props?.to}`}
      onClick={(e) => {
        if (!props?.target) {
          if (process.env.FRAME_MODE && parent.window?.historyPush) {
            e.preventDefault();
            parent.window.historyPush(
              `${props?.native ? mainRoute : ""}${props?.to}`,
              true
            );
          }
        }
      }}
    >
      {props?.children}
    </a>
  );
};
