import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TopicInput } from "@/components/create/TopicInput";

export default function CreatePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold tracking-tight mb-6">Create a New Survey</h1>
            <p className="text-muted-foreground mb-10 text-center max-w-md">
              Enter a topic, and we'll generate questions to help you gather the insights you need.
            </p>
            
            <TopicInput />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}