type Step = {
  title: string;
  description: string;
};

type Props = {
  steps: Step[];
};

export default function StepGuide({ steps }: Props) {
  return (
    <div className="my-6 space-y-4">
      {steps.map((step, i) => (
        <div
          key={i}
          className="flex gap-4 rounded-xl border border-neutral-200 bg-white p-5"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-700 text-sm font-bold text-white">
            {i + 1}
          </div>
          <div>
            <h4 className="font-bold text-neutral-900">{step.title}</h4>
            <p className="mt-1 text-sm leading-relaxed text-neutral-700">
              {step.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
