
export default function SuccessMessage({ children }: { children: React.ReactNode}) {
    return (
      <div className="text-center mt-1 bg-cyan-200 text-gray-900 font-bold py-1 uppercase text-sm rounded-lg">
        {children}
      </div>
    );
  }
  