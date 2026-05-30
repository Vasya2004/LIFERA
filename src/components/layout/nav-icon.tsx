type NavIconProps = {
  name: string;
};

const iconPaths: Record<string, string[]> = {
  assistant: [
    "M12 3v3",
    "M7 8h10a3 3 0 0 1 3 3v4a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5v-4a3 3 0 0 1 3-3Z",
    "M9 13h.01",
    "M15 13h.01",
    "M10 17h4",
  ],
  award: [
    "M8 4h8l2 4-6 11L6 8l2-4Z",
    "M6 8h12",
    "M10 8l2 11 2-11",
  ],
  billing: [
    "M6 5h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z",
    "M4 9h16",
    "M8 15h4",
  ],
  calendar: [
    "M6 5h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z",
    "M8 3v4",
    "M16 3v4",
    "M4 10h16",
  ],
  check: ["M5 12l4 4L19 6", "M4 20h16"],
  challenge: [
    "M7 4h10v4a5 5 0 0 1-10 0V4Z",
    "M5 6H3a4 4 0 0 0 4 4",
    "M19 6h2a4 4 0 0 1-4 4",
    "M12 13v5",
    "M8 20h8",
  ],
  folder: [
    "M4 7a2 2 0 0 1 2-2h4l2 2h6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z",
  ],
  health: ["M12 20s-7-4.5-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5.5-7 10-7 10Z"],
  heart: ["M12 20s-7-4.5-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5.5-7 10-7 10Z"],
  home: ["M4 11l8-7 8 7", "M6 10v10h12V10", "M10 20v-6h4v6"],
  menu: ["M4 7h16", "M4 12h16", "M4 17h16"],
  progress: ["M4 19V5", "M4 19h16", "M8 15l3-3 3 2 5-7"],
  ritual: [
    "M12 3v4",
    "M7 8h10",
    "M8 8v5a4 4 0 0 0 8 0V8",
    "M9 18h6",
    "M10 21h4",
  ],
  settings: [
    "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
    "M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.4 1a7 7 0 0 0-2-1.2L14 3h-4l-.5 2.7a7 7 0 0 0-2 1.2l-2.4-1-2 3.4 2 1.5A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.4 2.4-1a7 7 0 0 0 2 1.2L10 21h4l.5-2.7a7 7 0 0 0 2-1.2l2.4 1 2-3.4-2-1.5c.1-.4.1-.8.1-1.2Z",
  ],
  spark: ["M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"],
  target: ["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z", "M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z", "M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"],
  user: ["M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z", "M4 21a8 8 0 0 1 16 0"],
  wallet: ["M5 6h13a2 2 0 0 1 2 2v10H6a2 2 0 0 1-2-2V7a1 1 0 0 1 1-1Z", "M16 12h4", "M7 6V4h9v2"],
};

export function NavIcon({ name }: NavIconProps) {
  const paths = iconPaths[name] ?? iconPaths.home;

  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      {paths.map((path) => (
        <path d={path} key={path} />
      ))}
    </svg>
  );
}
