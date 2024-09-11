import { usePathname } from "next/navigation";

import { TabsContainer, TabsLink } from "../tabs-link";

const pagesConfig = [
  {
    title: "Live Now",
    href: "",
  },
  {
    title: "Orders",
    href: "/orders",
  },
  {
    title: "Account",
    href: "/account",
  }
];

export function AppTabs() {
  const pathname = usePathname();

  return (
    <div className="-mb-3">
      <TabsContainer>
        {pagesConfig.map(({ title, href }) => {
          const active = `/dashboard${href}` === pathname;
          return (
            <TabsLink
              key={title}
              active={active}
              href={`/dashboard${href}`}
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
