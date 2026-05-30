type PageTitleProps = {
  subtitle?: string;
  title: string;
};

export function PageTitle({ subtitle, title }: PageTitleProps) {
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
      {subtitle ? <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p> : null}
    </div>
  );
}
