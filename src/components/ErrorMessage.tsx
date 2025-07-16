export default function ErrorMessage({ children }: { children: React.ReactNode}) {
    return (
      <div className="text-center mt-1 bg-red-200 text-red-600 font-bold py-1 uppercase text-sm rounded-lg">
        {children}
      </div>
    );
  }
  