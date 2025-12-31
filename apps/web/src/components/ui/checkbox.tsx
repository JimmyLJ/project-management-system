import * as React from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { Check } from 'lucide-react'

import { cn } from '../../lib/utils'

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'peer h-4 w-4 shrink-0 cursor-pointer rounded border border-black/20 bg-white shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1c7c8c] focus-visible:ring-offset-2 data-[state=checked]:border-[#1c7c8c] data-[state=checked]:bg-[#1c7c8c] dark:border-slate-700 dark:bg-slate-900 dark:focus-visible:ring-slate-400 dark:focus-visible:ring-offset-slate-950',
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn('flex items-center justify-center text-white')}
    >
      <Check className="h-3.5 w-3.5" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
