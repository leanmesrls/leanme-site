export default function LeanYouRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="fixed inset-0 z-[250] overflow-y-auto bg-black">
      {children}
    </div>
  );
}
