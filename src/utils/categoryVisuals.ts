import { BaggageClaim, Shirt, ShoppingBag, type LucideIcon } from 'lucide-vue-next'

export interface CategoryVisual {
  gradient: string
  icon: LucideIcon
}

const CATEGORY_VISUALS: Record<string, CategoryVisual> = {
  clothes: {
    gradient: 'from-brand-600 to-brand-800',
    icon: Shirt,
  },
  shoes: {
    gradient: 'from-amber-400 to-orange-500',
    icon: ShoppingBag,
  },
  bags: {
    gradient: 'from-emerald-400 to-teal-600',
    icon: BaggageClaim,
  },
}

const FALLBACK_VISUAL: CategoryVisual = {
  gradient: 'from-stone-400 to-stone-600',
  icon: ShoppingBag,
}

export function getCategoryVisual(categoryName?: string, categoryId?: number): CategoryVisual {
  if (categoryName) {
    const slug = categoryName.toLowerCase().trim()
    const match = CATEGORY_VISUALS[slug]

    if (match) {
      return match
    }
  }

  if (categoryId !== undefined) {
    const idVisuals = Object.values(CATEGORY_VISUALS)
    return idVisuals[categoryId % idVisuals.length] ?? FALLBACK_VISUAL
  }

  return FALLBACK_VISUAL
}

export function getCategoryInitial(categoryName?: string): string {
  if (!categoryName || categoryName.length === 0) {
    return '?'
  }

  return categoryName.charAt(0).toUpperCase()
}
