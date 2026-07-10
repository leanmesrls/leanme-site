export default function LeanYouRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="bg-black text-white">{children}</div>;
}
