import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Megaphone, School, CalendarDays } from 'lucide-react';

const timelineEvents = [
  {
    icon: Megaphone,
    title: 'State Scholarship Application Opens',
    date: 'August 15, 2024',
    description: 'Applications for the annual state merit scholarship are now open for all eligible students.',
  },
  {
    icon: School,
    title: 'University Entrance Exam Registration',
    date: 'September 01, 2024',
    description: 'Registration for the Common University Entrance Test (CUET) begins.',
  },
  {
    icon: CalendarDays,
    title: 'Admission Counseling Begins',
    date: 'September 20, 2024',
    description: 'First round of online counseling for government college admissions starts.',
  },
];

export function Timeline() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Timeline Tracker</CardTitle>
        <CardDescription>Stay updated with important dates and deadlines.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-6">
          {timelineEvents.map((event, index) => (
            <li key={index} className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <event.icon className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div>
                <p className="font-semibold">{event.title}</p>
                <p className="text-sm text-muted-foreground">{event.date}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
