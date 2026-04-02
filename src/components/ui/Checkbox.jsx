import { forwardRef } from 'react'
import { clsx } from 'clsx'

export const Checkbox = forwardRef(({ 
  label, 
  className, 
  ...props 
}, ref) => {
  return (
    <label className={clsx('inline-flex items-center gap-2 cursor-pointer', className)}>
      <input
        ref={ref}
        type="checkbox"
        className="w-4 h-4 text-primary-600 rounded border-gray-300 dark:border-gray-600 focus:ring-primary-500"
        {...props}
      />
      {label && <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>}
    </label>
  )
})

Checkbox.displayName = 'Checkbox'
