import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '../../lib/utils'

const buttonVariants = cva(
  'inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1c7c8c] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ring-offset-white dark:focus-visible:ring-slate-400 dark:ring-offset-slate-950',
  {
    variants: {
      variant: {
        default:
          'bg-[#0b0d12] text-white hover:bg-[#1c2333] dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white',
        link: 'text-[#1c7c8c] underline-offset-4 hover:underline hover:text-[#155a65] dark:text-teal-300 dark:hover:text-teal-200',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3',
        lg: 'h-11 px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />
  )
}

export { Button, buttonVariants }
