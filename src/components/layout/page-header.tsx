type PageHeaderProps = {
  title: string;
  description: string;
};

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <header className="border-b border-border bg-surface/80 px-5 py-6 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-medium text-muted">LifeOS Core MVP</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h1>
        <p className="mt-3 max-w-3xl leading-7 text-muted">{description}</p>
      </div>
    </header>
  );
}
