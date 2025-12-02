import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lock, Zap, ArrowRight } from 'lucide-react'
import Link from "next/link"
import { getPlanName, type PlanType } from "@/lib/plan-access"

interface PlanUpgradePromptProps {
  currentPlan: PlanType
  featureName: string
  requiredPlan: PlanType
  description?: string
}

export function PlanUpgradePrompt({ currentPlan, featureName, requiredPlan, description }: PlanUpgradePromptProps) {
  return (
    <Card className="p-8 text-center border-dashed border-2">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mb-4">
        <Lock className="w-8 h-8 text-white" />
      </div>
      
      <h3 className="text-xl font-bold mb-2">{featureName}</h3>
      
      <p className="text-muted-foreground mb-4">
        {description || `Este recurso está disponível no ${getPlanName(requiredPlan)} ou superior.`}
      </p>
      
      <div className="flex items-center justify-center gap-2 mb-6">
        <Badge variant="outline">{getPlanName(currentPlan)}</Badge>
        <ArrowRight className="w-4 h-4 text-muted-foreground" />
        <Badge className="bg-gradient-to-r from-blue-600 to-purple-600">
          {getPlanName(requiredPlan)}
        </Badge>
      </div>
      
      <Link href="/dashboard/pricing">
        <Button className="gap-2">
          <Zap className="w-4 h-4" />
          Fazer Upgrade do Plano
        </Button>
      </Link>
    </Card>
  )
}
