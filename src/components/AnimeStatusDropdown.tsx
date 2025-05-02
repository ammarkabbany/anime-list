"use client";

import React, { useState } from "react";
import { Check, ChevronDown, PlusCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AnimeListStatus } from "@/types/animelist";
import { useRouter } from "next/navigation";

const statusOptions: { value: AnimeListStatus; label: string }[] = [
  { value: AnimeListStatus.Watching, label: "Watching" },
  { value: AnimeListStatus.Completed, label: "Completed" },
  { value: AnimeListStatus.OnHold, label: "On Hold" },
  { value: AnimeListStatus.Dropped, label: "Dropped" },
  { value: AnimeListStatus.PlanToWatch, label: "Plan to Watch" },
];

interface AnimeStatusDropdownProps {
  animeId: string;
  animeTitle: string;
  animeImage: string;
  initialStatus?: AnimeListStatus;
  onStatusChange?: (status: AnimeListStatus) => void;
}

const AnimeStatusDropdown = ({
  initialStatus,
  onStatusChange,
}: AnimeStatusDropdownProps) => {
  const [status, setStatus] = useState<AnimeListStatus | undefined>(
    initialStatus,
  );
  const router = useRouter();

  const handleStatusChange = (newStatus: AnimeListStatus) => {
    setStatus(newStatus);

    if (onStatusChange) {
      onStatusChange(newStatus);
      router.refresh();
    }
  };

  const getStatusColor = (statusValue: AnimeListStatus): string => {
    switch (statusValue) {
      case AnimeListStatus.Watching:
        return "bg-blue-500 hover:bg-blue-600";
      case AnimeListStatus.Completed:
        return "bg-green-500 hover:bg-green-600";
      case AnimeListStatus.OnHold:
        return "bg-yellow-500 hover:bg-yellow-600";
      case AnimeListStatus.Dropped:
        return "bg-red-500 hover:bg-red-600";
      case AnimeListStatus.PlanToWatch:
        return "bg-purple-500 hover:bg-purple-600";
      default:
        return "bg-blue-500 hover:bg-blue-600";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="default"
          className={`flex items-center justify-center gap-2 text-white transition-colors ${
            status ? getStatusColor(status) : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {status ? (
            <Check className="h-4 w-4" />
          ) : (
            <PlusCircleIcon className="h-4 w-4" />
          )}
          {status
            ? statusOptions.find((opt) => opt.value === status)?.label
            : "Add to List"}
          <ChevronDown className="ml-1 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-48">
        {statusOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            className="flex cursor-pointer items-center gap-2"
            onClick={() => handleStatusChange(option.value)}
          >
            {status === option.value && <Check className="h-4 w-4" />}
            <span className={status === option.value ? "font-medium" : ""}>
              {option.label}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AnimeStatusDropdown;
