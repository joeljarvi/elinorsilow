export default function BorderWrapper() {
  return (
    <>
      <div className="fixed top-0 left-0 bg-background w-3 z-30 h-screen"></div>
      <div className="fixed top-0 left-0 bg-background h-3 z-40 w-full "></div>
      <div className="fixed top-0 right-0 bg-background w-3 z-40 h-screen"></div>
    </>
  );
}
