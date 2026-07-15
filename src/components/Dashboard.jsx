import { Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

const Dashboard = ({ userName, subtitle, metrics, children }) => {
  return (
    <div className="flex h-screen bg-slate-950 text-slate-50 font-sans">
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              ¡Hola, {userName}!
            </h1>
            <p className="text-slate-400 text-sm mt-1">{subtitle}</p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-50"
            >
              <Bell className="h-4 w-4" />
            </Button>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {metrics.map((metric, idx) => (
            <Card
              key={idx}
              className="bg-slate-900 border-slate-800 text-slate-50"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">
                  {metric.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {children}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
