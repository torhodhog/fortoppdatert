"use client";

interface FixedBottomWrapperProps {
  children: React.ReactNode;
}

export default function FixedBottomWrapper({ children }: FixedBottomWrapperProps) {
  return (
    <div className="w-full h-[60px] flex justify-end items-center px-6 absolute bottom-0 left-0">
      {children}
    </div>
  );
}
