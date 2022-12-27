import React from "react";

const svgOptions = {
  "aria-hidden": true,
  "focusable": false,
  "role": "img",
  "xmlns": "http://www.w3.org/2000/svg",
  "viewBox": "0 0 48 48",
}

export function IconSkiingFreestyle(): JSX.Element {
  return (
    <svg
      {...svgOptions}
      className="custom-svg-icon skiing-freestyle"
    >
      <path
        fill="currentColor"
        d="m28.9 41.4 11.5-25.5c.9-2.2 1.4-4.8-.8-5.1-.3 0-.6 0-1.2.5l-1 1.9c-.2.4-.5 1.1-.7 1.5-2 4.3-11.5 25.5-11.5 25.5-.2.4-.2.9 0 1.3.7 1.4 3.2 1.3 3.7-.1zM22.8 36.1c.2-.4.2-.9 0-1.3 0 0-9.5-21.2-11.5-25.5-.2-.4-.5-1.1-.7-1.5L9.6 6c-.6-.5-.9-.5-1.2-.5-2.2.3-1.7 2.9-.8 5.1l11.5 25.5c.5 1.3 3 1.4 3.7 0z"
      />
    </svg>
  );
};

export function IconSkiingTraditional(): JSX.Element {
  return (
    <svg
      {...svgOptions}
      className="custom-svg-icon skiing-traditional"
    >
      <path
        fill="currentColor"
        d="M7.4 20.4c0 1 .8 1.9 1.9 1.9h30c3.2 0 5.1-1.8 4.8-4-.1-.4-.4-.3-.7-.2-.6.1-1.4.5-3.2.5h-31c-1-.1-1.8.7-1.8 1.8zM3.9 28.2c0 1 .8 1.9 1.9 1.9h30c3.2 0 5.1-1.8 4.8-4-.1-.4-.4-.3-.7-.2-.6.1-1.4.5-3.2.5h-31c-1-.1-1.8.7-1.8 1.8z"
      />
    </svg>
  );
};

export function IconSkiingDogSkijoring(): JSX.Element {
  return (
    <svg
      {...svgOptions}
      className="custom-svg-icon skiing-dog-skijoring"
    >
      <path
        fill="currentColor"
        d="m12.5 10.7 2 2.7 1 1.3h8.7c.8 0 1.6.3 2.2.9l2.4 2.4 1 1h8.8v3.1c0 4.1-3.3 7.4-7.4 7.4H19l-.4 6-8.8-5 2.7-19.8m-.1-3.6c-1.6 0-2.9 1.1-3.1 2.7L6.1 32.3l15 8.6.7-7.9h9.3c5.9 0 10.7-4.8 10.7-10.7V19c0-1.8-1.4-3.2-3.2-3.2h-7.5l-2.4-2.4a6.42 6.42 0 0 0-4.6-1.9h-7l-2.3-3c-.5-.9-1.4-1.4-2.4-1.4z"
      />
      <circle fill="currentColor" cx="23.4" cy="19.2" r="2.1" />
    </svg>
  );
};
