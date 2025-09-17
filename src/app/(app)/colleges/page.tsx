import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Home, Library, Microscope, Search, Wifi } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const colleges = [
  {
    name: 'Govt. College of Excellence, Cityville',
    imageUrlId: 'college-1',
    courses: ['B.Sc. Computer Science', 'B.A. English', 'B.Com'],
    facilities: ['Hostel', 'Library', 'Lab'],
    medium: 'English, Hindi',
  },
  {
    name: 'City Science College',
    imageUrlId: 'college-2',
    courses: ['B.Sc. Physics', 'B.Sc. Chemistry', 'B.Sc. Biology'],
    facilities: ['Library', 'Lab', 'Wifi'],
    medium: 'English',
  },
  {
    name: 'Arts & Commerce Institute, Townsville',
    imageUrlId: 'college-3',
    courses: ['B.A. History', 'B.A. Economics', 'B.Com (Hons)', 'BBA'],
    facilities: ['Hostel', 'Library', 'Wifi'],
    medium: 'Hindi',
  },
  {
    name: 'Regional Vocational College',
    imageUrlId: 'college-4',
    courses: ['B.Voc. Software Dev', 'B.Voc. Tourism', 'B.Voc. Retail Mgmt'],
    facilities: ['Lab', 'Wifi'],
    medium: 'English',
  },
];

const facilityIcons: { [key: string]: React.ReactElement } = {
  Hostel: <Home className="h-4 w-4" />,
  Library: <Library className="h-4 w-4" />,
  Lab: <Microscope className="h-4 w-4" />,
  Wifi: <Wifi className="h-4 w-4" />,
};

export default function CollegesPage() {
  const getImage = (id: string) => {
    return PlaceHolderImages.find(img => img.id === id) ?? { imageUrl: '', imageHint: '' };
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Find Nearby Government Colleges</h1>
        <p className="text-muted-foreground">Search for colleges and explore their programs, facilities, and more.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input placeholder="Search by college name, city, or course..." className="pl-10" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {colleges.map((college, index) => {
          const { imageUrl, imageHint } = getImage(college.imageUrlId);
          return (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative h-48 w-full">
                <Image
                  src={imageUrl}
                  alt={`Campus of ${college.name}`}
                  fill
                  className="object-cover"
                  data-ai-hint={imageHint}
                />
              </div>
              <CardHeader>
                <CardTitle>{college.name}</CardTitle>
                <CardDescription>Medium: {college.medium}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 text-sm">Courses Offered</h4>
                  <div className="flex flex-wrap gap-2">
                    {college.courses.map((course) => (
                      <Badge key={course} variant="secondary">{course}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-sm">Facilities</h4>
                  <div className="flex flex-wrap gap-4">
                    {college.facilities.map((facility) => (
                      <div key={facility} className="flex items-center gap-2 text-muted-foreground">
                        {facilityIcons[facility]}
                        <span className="text-sm">{facility}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
