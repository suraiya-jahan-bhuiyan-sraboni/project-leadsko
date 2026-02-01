"use client";
import React, { useState } from "react";
import { FileItemType, FolderType } from "@/data/folder";
import { FaFolder, FaFolderOpen } from "react-icons/fa6";
import { ChevronDown, ChevronRight } from "lucide-react";
import useSWR, { KeyedMutator } from "swr";
import { fetcher } from "@/app/lib/fetcher";
import FileItem from "../FileItem";

interface SidebarProps {
  folders: FolderType[];
  selectedFolder: string;
  setSelectedFolder: (folderId: string) => void;
  mutateFolderData?: KeyedMutator<{ data: FolderType[] }>;
}

const FolderItem = ({
  folder,
  level = 0,
  selectedFolder,
  setSelectedFolder,
}: {
  folder: FolderType;
  level?: number;
  selectedFolder: string;
  setSelectedFolder: (folderId: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const hasSubfolders =
    Array.isArray(folder.subfolders) && folder.subfolders.length > 0;
  const isSelected = selectedFolder === folder._id;

  // Fetch files for this folder ONLY if it is selected
  const { data: folderFilesRes } = useSWR(
    isSelected ? `/app/${folder._id}/files` : null,
    fetcher,
  );

  const files = folderFilesRes?.data?.files || [];

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFolder(folder._id);
    setIsOpen(!isOpen);
  };

  const { fileCount = 0, subfolderCount = 0, totalLeads = 0 } = folder;

  return (
    <li className="w-full list-none">
      <div
        onClick={handleClick}
        className={`flex items-center justify-between py-2 px-3 rounded cursor-pointer transition-all mb-1
          ${isSelected ? "border-2 border-blue-500 bg-white" : "hover:bg-gray-200"}
        `}
        style={{ marginLeft: `${level * 12}px` }}
      >
        <div className="flex items-center gap-2">
          {isOpen ? (
            <FaFolderOpen className="text-yellow-500 text-lg" />
          ) : (
            <FaFolder className="text-yellow-400 text-lg" />
          )}
          <div>
            <div className="font-semibold capitalize text-sm">
              {folder.name}
            </div>
            <div className="text-[10px] text-gray-500">
              {totalLeads} Leads • {subfolderCount} Folders • {fileCount} Files
            </div>
          </div>
        </div>
        {hasSubfolders && (
          <div>
            {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </div>
        )}
        {!hasSubfolders &&isOpen && <ChevronDown size={14} />}
      </div>

      {/* SUBFOLDERS RENDERING */}
      {isOpen && hasSubfolders && (
        <ul className="border-l border-gray-300 ml-4">
          {folder.subfolders?.map((sub) => (
            <FolderItem
              key={sub._id}
              folder={sub}
              level={level + 1}
              selectedFolder={selectedFolder}
              setSelectedFolder={setSelectedFolder}
            />
          ))}
        </ul>
      )}

      {/* FILES RENDERING - Only if selected, open, and has no subfolders  */}
      {isOpen && isSelected && !hasSubfolders && (
        <div className="mt-2 ml-2 space-y-2">
          {files.length > 0 ? (
            files.map((file: FileItemType) => (
              <FileItem key={file._id} file={{ ...file, _id: file._id }} />
            ))
          ) : (
            <div className="text-gray-400 text-xs py-2 italic text-center">
              No files in this folder
            </div>
          )}
        </div>
      )}
    </li>
  );
};

export default function SidebarMobile({
  folders,
  selectedFolder,
  setSelectedFolder,
}: SidebarProps) {
  return (
    <aside className="w-full lg:w-1/5 min-w-[250px] bg-gray-100 border-r border-gray-200 flex flex-col overflow-hidden text-black px-3">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gray-100 pb-3 border-b border-gray-200">
        <h1 className="text-2xl font-bold pt-4">Leads Directory</h1>
        <h2 className="text-xl font-bold text-gray-500">Categories</h2>
      </div>

      {/* Folder list */}
      <ul className="space-y-1 mt-4 overflow-y-auto flex-1 pr-2">
        {folders.map((folder) => (
          <FolderItem
            key={folder._id}
            folder={folder}
            selectedFolder={selectedFolder}
            setSelectedFolder={setSelectedFolder}
          />
        ))}
      </ul>
    </aside>
  );
}
