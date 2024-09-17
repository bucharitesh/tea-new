import { useSearchParams } from "next/navigation";

import { TabsContainer, TabsLink } from "../tabs-link";

const pagesConfig = [
  {
    title: "Live Now",
    href: "",
  },
  {
    title: "Orders",
    href: "orders",
  },
  {
    title: "Account",
    href: "account",
  },
  {
    title: "Cart",
    href: "cart",
  },
];

export function AppTabs() {
  const searchParams = useSearchParams();

  return (
    <div className="-mb-3">
      <TabsContainer>
        {pagesConfig.map(({ title, href }) => {
          const active =
            href === searchParams.get("tab") ||
            (!searchParams.get("tab") && href === "");
          return (
            <TabsLink
              key={title}
              active={active}
              href={href !== "" ? `/dashboard?tab=${href}` : "/dashboard"}
              prefetch={false}
            >
              {title}
            </TabsLink>
          );
        })}
      </TabsContainer>
    </div>
  );
}
