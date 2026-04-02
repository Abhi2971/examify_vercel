import { useAuth } from '../context/AuthContext'

export function useSupportTier() {
  const { user } = useAuth()
  
  const tier = user?.support_tier?.toLowerCase() || 'l1'
  const isL1 = tier === 'l1'
  const isL2 = tier === 'l2'
  const isL3 = tier === 'l3'
  
  const tierConfig = {
    l1: { 
      label: 'L1 Support', 
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/20',
      textColor: 'text-blue-400',
      borderColor: 'border-blue-500/30'
    },
    l2: { 
      label: 'L2 Support', 
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500/20',
      textColor: 'text-purple-400',
      borderColor: 'border-purple-500/30'
    },
    l3: { 
      label: 'L3 Lead', 
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-500/20',
      textColor: 'text-amber-400',
      borderColor: 'border-amber-500/30'
    }
  }
  
  return {
    tier,
    isL1,
    isL2,
    isL3,
    config: tierConfig[tier],
    allConfigs: tierConfig
  }
}
