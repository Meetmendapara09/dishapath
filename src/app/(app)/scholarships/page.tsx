import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Trophy, School, IndianRupee, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const scholarships = [
  {
    name: 'National Merit Scholarship',
    provider: 'Government of India',
    imageUrlId: 'scholarship-1',
    eligibility: ['Passed Class 12', 'Top 20 percentile'],
    amount: '₹10,000 - ₹20,000 per year',
    deadline: 'October 31, 2024',
    link: '#',
  },
  {
    name: 'State Science Talent Search',
    provider: 'State Education Board',
    imageUrlId: 'scholarship-2',
    eligibility: ['Studying in Class 11/12 (Science)', 'Domicile of State'],
    amount: '₹5,000 one-time',
    deadline: 'September 15, 2024',
    link: '#',
  },
  {
    name: 'Sarojini Excellence Scholarship for Girls',
    provider: 'Future India Foundation',
    imageUrlId: 'scholarship-3',
    eligibility: ['Female students', 'Family income < ₹6 LPA'],
    amount: 'Full tuition fee waiver',
    deadline: 'November 30, 2024',
    link: '#',
  },
  {
    name: 'Digital India Scholarship',
    provider: 'Ministry of IT',
    imageUrlId: 'scholarship-4',
    eligibility: ['Pursuing IT/Computer Science', '60% in Class 12'],
    amount: '₹30,000 per year',
    deadline: 'December 25, 2024',
    link: '#',
  },
];

export default function ScholarshipsPage() {
   const getImage = (id: string) => {
    return PlaceHolderImages.find(img => img.id === id) ?? { imageUrl: '', imageHint: '' };
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Find Scholarships</h1>
        <p className="text-muted-foreground">Explore and apply for scholarships to fund your education.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input placeholder="Search by name, provider, or eligibility..." className="pl-10" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {scholarships.map((scholarship, index) => {
          const { imageUrl, imageHint } = getImage(scholarship.imageUrlId);
          return (
          <Card key={index} className="flex flex-col">
            <div className="relative h-48 w-full">
              <Image
                src={imageUrl}
                alt={`Image for ${scholarship.name}`}
                fill
                className="object-cover rounded-t-lg"
                data-ai-hint={imageHint}
              />
            </div>
            <CardHeader>
              <CardTitle>{scholarship.name}</CardTitle>
              <CardDescription className="flex items-center gap-2 pt-1"><School className="h-4 w-4" /> {scholarship.provider}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-grow">
              <div>
                <h4 className="font-semibold mb-2 text-sm flex items-center gap-2"><Trophy className="h-4 w-4 text-accent" />Eligibility</h4>
                <div className="flex flex-wrap gap-2">
                  {scholarship.eligibility.map((criterion) => (
                    <Badge key={criterion} variant="outline">{criterion}</Badge>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <h4 className="font-semibold mb-2 text-sm flex items-center gap-2"><IndianRupee className="h-4 w-4 text-accent" />Amount</h4>
                    <p className="text-sm">{scholarship.amount}</p>
                </div>
                <div>
                    <h4 className="font-semibold mb-2 text-sm flex items-center gap-2"><Calendar className="h-4 w-4 text-accent" />Deadline</h4>
                    <p className="text-sm">{scholarship.deadline}</p>
                </div>
              </div>
            </CardContent>
            <div className="p-6 pt-0">
                <Button asChild className="w-full">
                    <Link href={scholarship.link}>
                        Learn More & Apply
                    </Link>
                </Button>
            </div>
          </Card>
        );
        })}
      </div>
    </div>
  );
}
