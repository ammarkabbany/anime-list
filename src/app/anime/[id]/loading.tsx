import { Loader2 } from "lucide-react";


export default function Loading() {
  return (
    <div className="min-h-[90vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-primary size-12" />
      <p className="text-lg font-semibold text-primary/80">Summoning Anime Details...</p>
    </div>
  )
}