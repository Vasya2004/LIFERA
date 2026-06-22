type BranchDisclaimerProps = {
  text: string;
};

export function BranchDisclaimer({ text }: BranchDisclaimerProps) {
  return (
    <p className="rounded-[var(--radius-control)] border border-border bg-surface-muted/60 px-4 py-3 text-xs leading-5 text-muted-foreground">
      {text}
    </p>
  );
}
