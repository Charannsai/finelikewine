"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { Explorer } from "@/components/explorer";
import { Shell, Topbar } from "@/components/chrome";
import { Modal, ModalHead, ModalFoot, Field, Input, Select, Button, useToast } from "@/components/ui";

const CRUMBS: [string, string][] = [
  ["/", "Overview"],
  ["/foundations/colors", "Color"], ["/foundations/typography", "Typography"],
  ["/components/buttons", "Buttons"], ["/components/badges", "Badges & tags"], ["/components/forms", "Inputs & controls"],
  ["/components/cards", "Cards"], ["/components/tables", "Tables"], ["/components/navigation", "Tabs & menus"],
  ["/components/overlays", "Modal, toast & palette"], ["/components/charts", "Charts"], ["/components/feedback", "Feedback & states"],
  ["/resources/pages", "Pages"],
];

export default function LibraryLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const toast = useToast();
  const [monitorModal, setMonitorModal] = useState(false);
  const current = CRUMBS.find(([h]) => h === pathname)?.[1] ?? "Library";
  return (
    <Shell
      sidebar={<Explorer />}
      topbar={<Topbar crumbs={<>Library › <b className="text-ink">{current}</b></>} actions={[
        { label: "Overview", icon: "home-02", href: "/", group: "Go to" },
        { label: "Colors", icon: "paint-board", href: "/foundations/colors", group: "Foundations" },
        { label: "Typography", icon: "text-font", href: "/foundations/typography", group: "Foundations" },
        { label: "Buttons", href: "/components/buttons", group: "Components" },
        { label: "Badges and tags", href: "/components/badges", group: "Components" },
        { label: "Inputs and controls", href: "/components/forms", group: "Components" },
        { label: "Cards", href: "/components/cards", group: "Components" },
        { label: "Tables", href: "/components/tables", group: "Components" },
        { label: "Tabs and menus", href: "/components/navigation", group: "Components" },
        { label: "Modal, toast and palette", href: "/components/overlays", group: "Components" },
        { label: "Charts", href: "/components/charts", group: "Components" },
        { label: "Feedback and states", href: "/components/feedback", group: "Components" },
        { label: "Page designs", icon: "grid-view", href: "/resources/pages", group: "Resources" },
        { label: "Vigil dashboard demo", icon: "grid-view", href: "/dashboard", group: "Demos" },
        { label: "Meridian landing", icon: "rocket-01", href: "/landing/meridian", group: "Demos" },
        { label: "Fieldnotes landing", icon: "mail-01", href: "/landing/fieldnotes", group: "Demos" },
        { label: "New monitor", icon: "add-01", kbd: "C", onSelect: () => setMonitorModal(true), group: "Actions" },
        { label: "Copy clone URL", icon: "copy-01", group: "Actions" },
      ]} />}
    >
      {children}
      <footer className="mt-[56px] flex flex-wrap justify-between gap-[12px] border-t border-line py-[26px] text-[12.5px] text-ink3">
        <span>FineLikeWine · open source · icons by <a href="https://hugeicons.com" className="underline">Hugeicons</a> (MIT)</span>
        <span>Built by <a href="https://github.com/Charannsai" className="underline">Charannsai</a> · Next.js, TypeScript and Tailwind</span>
      </footer>
      <Modal open={monitorModal} onClose={() => setMonitorModal(false)} label="New monitor">
        <ModalHead icon="add-01" iconBg="var(--color-winebg)" title="New monitor" sub="Vigil checks it every 30 seconds from three regions." onClose={() => setMonitorModal(false)} />
        <div className="flex flex-col gap-[14px] px-[18px] py-[16px]">
          <Field label="URL"><Input placeholder="https://api.yoursite.com/health" /></Field>
          <Field label="Alert after"><Select><option>3 consecutive failures</option><option>First failure</option><option>5 consecutive failures</option></Select></Field>
        </div>
        <ModalFoot>
          <Button variant="secondary" onClick={() => setMonitorModal(false)}>Cancel</Button>
          <Button onClick={() => { setMonitorModal(false); toast("Monitor created"); }}>Create monitor</Button>
        </ModalFoot>
      </Modal>
    </Shell>
  );
}
