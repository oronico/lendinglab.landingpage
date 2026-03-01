import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import Eligibility from "@/pages/Eligibility";
import PreQual from "@/pages/PreQual";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import OutcomeQualified from "@/pages/OutcomeQualified";
import OutcomeFlagged from "@/pages/OutcomeFlagged";
import OutcomeIneligible from "@/pages/OutcomeIneligible";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/eligibility" component={Eligibility} />
      <Route path="/prequal" component={PreQual} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/outcome/qualified" component={OutcomeQualified} />
      <Route path="/outcome/flagged" component={OutcomeFlagged} />
      <Route path="/outcome/ineligible" component={OutcomeIneligible} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
