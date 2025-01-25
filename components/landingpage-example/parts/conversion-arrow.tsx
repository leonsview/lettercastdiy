import { ArrowRight, ArrowDown } from "lucide-react"

export function ConversionArrow() {
  return (
    <div className="flex items-center justify-center w-32 md:w-24 py-4">
      <ArrowRight className="w-12 h-12 text-primary hidden md:block" />
      <ArrowDown className="w-12 h-12 text-primary md:hidden" />
    </div>
  )
}

