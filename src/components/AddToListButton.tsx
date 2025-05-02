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
        className="flex items-center justify-center gap-2 bg-blue-500 text-white transition-colors hover:bg-blue-600"
        disabled={isPending}
      >
        <PlusCircleIcon className="h-4 w-4" />
        {isPending ? "Adding..." : "Add to List"}
      </Button>
    </form>
  );
}