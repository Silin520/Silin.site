import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="wrap page-top flex min-h-[70svh] flex-col items-start justify-center pb-20">
      <p className="label label-cyan mb-4">ERROR / 404</p>
      <h1 className="display text-[clamp(4rem,16vw,12rem)]">
        <span className="glitch glitch-auto" data-text="NO SIGNAL">
          NO SIGNAL
        </span>
      </h1>
      <p className="mt-4 max-w-md text-mute">The page you are looking for has drifted out of this space.</p>
      <div className="mt-8">
        <Button href="/">Return home</Button>
      </div>
    </section>
  );
}
