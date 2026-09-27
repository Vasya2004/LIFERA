import "./doit.css";

export default function DoitLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="doit-scope">
      <main className="max-w-2xl w-full mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
