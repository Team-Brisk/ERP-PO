export default function Container({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-full overflow-x-hidden p-4 flex flex-col gap-4">
            {children}
        </div>
    );
}