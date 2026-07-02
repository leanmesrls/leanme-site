import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { Card } from "@/components/ui/Card";
import type { LeanAgent } from "@/types/content";

interface AgentCardProps {
  agent: LeanAgent;
}

export function AgentCard({ agent }: AgentCardProps) {
  return (
    <Card href={`/staff-ibrido/lean-agent/${agent.slug}`} className="h-full">
      <PlaceholderImage
        image={agent.cardImage}
        aspectRatio="portrait"
        className="rounded-none border-none"
      />
      <div className="p-6">
        <p className="text-sm font-medium text-leanme-purple">{agent.role}</p>
        <h3 className="mt-1 text-xl font-semibold">{agent.name}</h3>
        <p className="mt-2 text-sm text-leanme-gray-600">{agent.specialty}</p>
      </div>
    </Card>
  );
}
