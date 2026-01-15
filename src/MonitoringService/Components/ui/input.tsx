import * as React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { Eye, EyeOff } from 'lucide-react';

// Input variants
const inputVariants = cva(
  'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 transition-[color,box-shadow] outline-none w-full min-w-0 rounded-[10px] border shadow-xs',
  {
    variants: {
      variant: {
        default:
          'bg-background border-input focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
        outline:
          'bg-transparent border-input focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
        filled:
          'bg-card border border-transparent focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
      },
      size: {
        sm: 'h-8 px-2 text-[12px] rounded-md',
        md: 'h-14 px-3 text-sm',
        bt: 'h-10 px-3 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    return (
      <div className='relative w-full'>
        <input
          type={inputType}
          className={cn(inputVariants({ variant, size, className }), isPassword && 'pr-10')}
          ref={ref}
          {...props}
        />
        {isPassword && (
          <button
            type='button'
            onClick={() => { setShowPassword((prev) => !prev); }}
            className='absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground focus:outline-none'
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className='h-5 w-5' /> : <Eye className='h-5 w-5' />}
          </button>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
