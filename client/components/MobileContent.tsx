"use client";

import { useState,useMemo } from "react";
import Cart from "@/components/Cart";
import useSWR from "swr";
import { fetcher } from "@/app/lib/fetcher";
import SidebarMobile from "./mobile-sidebar/Sidebar";
import FloatingFooter from "./FloatingFooter";

export default function MobileContent() {
  // Fetch all folders
  const { data: foldersRes } = useSWR("/app/folders-with-subfolders", fetcher);
  const folders = useMemo(() => foldersRes?.data || [], [foldersRes]);

  const [selectedFolder, setSelectedFolder] = useState<string>("");

  return (
    <>
      <SidebarMobile
        folders={folders}
        selectedFolder={selectedFolder}
        setSelectedFolder={setSelectedFolder}
      />
      <Cart />
      {/* foating footer for mobile */}
      <FloatingFooter/>
    </>
  );
}
