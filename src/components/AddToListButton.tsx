"use client";

import { Button } from "@/components/ui/button";
import { PlusCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

interface AddToListButtonProps {
  animeId: string;
  action: (formData: FormData) => Promise<void>;
}

export default function AddToListButton({ animeId, action }: AddToListButtonProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <form action={(formData) => {
      startTransition(() => {
        void action(formData);
        router.refresh();
      });
    }}>
      <input type="hidden" name="animeId" value={animeId} />
      <Button
        type="submit"
        variant="default"
        // Removed bg-blue-500, hover:bg-blue-600 to use default variant's gradient and press effect
        className="flex items-center justify-center gap-2 text-white transition-colors"
        disabled={isPending}
      >
        <PlusCircleIcon className="h-4 w-4" />
        {isPending ? "Adding..." : "Add to List"}
      </Button>
    </form>
  );
}