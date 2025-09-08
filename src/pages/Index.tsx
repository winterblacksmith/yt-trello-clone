import { KanbanBoard } from "@/components/KanbanBoard";
import { Youtube, Calendar, TrendingUp } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-gradient-to-br from-youtube-red to-youtube-red-hover rounded-lg flex items-center justify-center">
                <Youtube className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                YouTube Studio
              </h1>
            </div>
            <div className="hidden md:flex items-center gap-6 ml-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Content Pipeline</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span>Video Management</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <KanbanBoard />
      </div>
    </div>
  );
};

export default Index;
