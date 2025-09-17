// src/app/(app)/future-tech/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit, Leaf, Building, ShieldCheck, Atom } from "lucide-react";

const futureTechTopics = [
  {
    icon: Atom,
    title: "AGI & Neuro-Symbolic AI",
    description: "Explore the frontiers of Artificial Intelligence, from machines that can reason and learn like humans (AGI) to hybrid models that combine neural networks with symbolic logic for more robust and explainable AI.",
    fields: ["AI Research Scientist", "Cognitive Systems Engineer", "Machine Learning Ethicist"],
  },
  {
    icon: Leaf,
    title: "Green Energy & Sustainability",
    description: "Dive into the technologies driving a sustainable future, including renewable energy sources (solar, wind, hydrogen), advanced battery storage, carbon capture, and circular economy models.",
    fields: ["Renewable Energy Engineer", "Sustainability Consultant", "Environmental Policy Analyst"],
  },
  {
    icon: Building,
    title: "Green Buildings & Smart Cities",
    description: "Learn about the intersection of architecture, engineering, and data science to create energy-efficient buildings and interconnected urban environments that improve quality of life and reduce environmental impact.",
    fields: ["Sustainable Architect", "Smart City Planner", "IoT Solutions Engineer"],
  },
  {
    icon: ShieldCheck,
    title: "AI Governance & Ethics",
    description: "As AI becomes more powerful, the need for rules and frameworks to ensure it is used safely and ethically is critical. This field focuses on creating policies and standards for responsible AI development.",
    fields: ["AI Policy Advisor", "Digital Ethicist", "AI Safety Researcher"],
  },
];

export default function FutureTechPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold flex items-center gap-3">
          <BrainCircuit className="text-primary"/> Explore Future Technologies
        </h1>
        <p className="text-muted-foreground">Discover the cutting-edge fields that are shaping the world of tomorrow.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {futureTechTopics.map((topic) => (
          <Card key={topic.title}>
            <CardHeader className="flex-row gap-4 items-center">
              <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <topic.icon className="h-6 w-6 text-primary" />
                  </div>
              </div>
              <div>
                <CardTitle>{topic.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>{topic.description}</CardDescription>
              <div className="mt-4">
                <h4 className="font-semibold text-sm text-foreground mb-2">Potential Career Areas:</h4>
                <div className="flex flex-wrap gap-2">
                    {topic.fields.map(field => <div key={field} className="text-xs bg-secondary text-secondary-foreground font-medium px-2 py-1 rounded-full">{field}</div>)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
