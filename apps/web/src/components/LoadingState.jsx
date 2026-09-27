'use client';

export default function LoadingState({ className = 'py-24' }) {
  return (
    <div className={`flex justify-center ${className}`}>
      <div className="h-7 w-7 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}
