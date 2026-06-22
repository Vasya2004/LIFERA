import { FinanceCreateAction } from "@/components/finance/finance-create-action";
import { FinanceHero } from "@/components/finance/finance-hero";
import { FinanceJournal } from "@/components/finance/finance-journal";
import { FinancePortfolio } from "@/components/finance/finance-portfolio";
import { FinanceSidePanel } from "@/components/finance/finance-side-panel";
import { FinanceTrend } from "@/components/finance/finance-trend";
import { FinanceWishes } from "@/components/finance/finance-wishes";
import { PageContent } from "@/components/layout/page-content";
import { Card } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth/session";
import {
  getFinanceBranchData,
  getFinancePortfolioData,
  getFinanceSubscriptions,
  type FinancePortfolioData,
  type FinanceSubscription,
} from "@/lib/domain/finance";
import { getWishesPageData, type WishesPageData } from "@/lib/domain/wishes-page";

export const dynamic = "force-dynamic";

type FinanceView = "overview" | "history";

type FinancePageProps = {
  searchParams: Promise<{ view?: string }>;
};

function parseFinanceView(view?: string): FinanceView {
  if (view === "history" || view === "snapshots") {
    return "history";
  }

  return "overview";
}

export default async function FinancePage({ searchParams }: FinancePageProps) {
  const params = await searchParams;
  const view = parseFinanceView(params.view);
  const { supabase, user } = await getCurrentUser();
  let data: Awaited<ReturnType<typeof getFinanceBranchData>> | null = null;
  let portfolio: FinancePortfolioData | null = null;
  let wishesData: WishesPageData | null = null;
  let subscriptions: FinanceSubscription[] = [];
  let loadError: string | null = null;

  if (supabase && user) {
    try {
      [data, portfolio, wishesData, subscriptions] = await Promise.all([
        getFinanceBranchData(supabase, user.id),
        getFinancePortfolioData(supabase, user.id).catch(() => null),
        getWishesPageData(supabase, user.id).catch(() => null),
        getFinanceSubscriptions(supabase, user.id).catch(() => []),
      ]);
    } catch (error) {
      loadError = error instanceof Error ? error.message : "Не удалось загрузить финансовые данные.";
    }
  }

  const savingsDelta =
    data?.latest && data.history[1]
      ? data.latest.savings_amount - data.history[1].savings_amount
      : null;
  const linkedWish =
    wishesData?.wishes.find(
      (wish) => wish.status !== "archived" && (Number(wish.target_amount ?? 0) > 0 || wish.category?.toLowerCase().includes("финанс")),
    ) ?? null;

  return (
    <PageContent aria-label="Финансы" className="min-h-[calc(100vh-var(--topbar-height))]">
      <FinanceCreateAction />

      <div
        aria-label={`Активный раздел финансов: ${view}`}
        className="grid min-w-0 gap-5 xl:gap-6"
        role="tabpanel"
      >

        {loadError ? (
          <Card className="border-danger/25 bg-danger-subtle">
            <p className="text-sm text-danger-foreground">{loadError}</p>
          </Card>
        ) : null}

        {!supabase || !user ? (
          <Card variant="muted">
            <p className="text-sm text-muted-foreground">Войдите, чтобы вести финансовый снимок.</p>
          </Card>
        ) : null}

        {data && view === "overview" ? (
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_340px] xl:gap-6 2xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="grid min-w-0 content-start gap-5 xl:gap-6">
              <FinanceHero
                financeScore={data.financeScore}
                history={data.history}
                latest={data.latest}
              />
              {portfolio ? <FinancePortfolio portfolio={portfolio} /> : null}
              <FinanceWishes goals={wishesData?.goals ?? []} wishes={wishesData?.wishes ?? []} />
              <FinanceTrend trend={data.trend} />
              <p className="text-xs text-muted-foreground">
                Lifera помогает видеть картину финансов, но не является финансовым консультантом.
              </p>
            </div>

            <aside className="min-w-0 self-start">
              <FinanceSidePanel linkedWish={linkedWish} latest={data.latest} savingsDelta={savingsDelta} subscriptions={subscriptions} />
            </aside>
          </div>
        ) : null}

        {data && view === "history" ? (
          <FinanceJournal entries={data.history} financeScore={data.financeScore} />
        ) : null}
      </div>
    </PageContent>
  );
}
