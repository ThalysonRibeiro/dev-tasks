import { getPriorities } from "../desktop/[id]/_data-access/get-priorities";
import { PrioritiesBar } from "../desktop/[id]/_components/priorities-bar";

export async function Priorities({ desktopId }: { desktopId: string }) {
  const data = await getPriorities(desktopId);
  return (
    <div className="w-full mt-auto">
      <PrioritiesBar priorities={data} label={false} />
    </div>
  )
}
