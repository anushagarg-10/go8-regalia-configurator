import Configurator from "@/components/Configurator";

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col lg:h-dvh">
      <header className="border-b border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
          Go8 Graduation Regalia Configurator
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Pick a Group of Eight university and degree level to preview the academic dress in 3D.
        </p>
      </header>
      <Configurator />
    </div>
  );
}
