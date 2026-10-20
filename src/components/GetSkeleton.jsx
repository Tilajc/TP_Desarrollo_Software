import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const CustomSkeleton = ({ count = 6, cardWidth = '100%' }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`}>
      {Array.from({ length: count }).map((_, i) => (
        <Card
          key={i}
          className="w-full max-w-xs h-48"
          style={{ maxWidth: cardWidth }}
        >
          <CardHeader className="space-y-2 h-24">
            <Skeleton className="w-2/3 h-12" />
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-1/2 h-4" />
          </CardHeader>
          <CardContent className="mt-4">
            <Skeleton className="w-full h-8" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CustomSkeleton;
