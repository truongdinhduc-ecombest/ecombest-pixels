import Canvas from "@/components/Canvas";

export default function Home() {
  return (
    <main className="h-screen flex items-center justify-center p-0 bg-gray-500">
      <div className="w-full h-full flex items-center justify-center">
        <Canvas canvasId="ecombest-pixels" />
      </div>
    </main>
  );
}
