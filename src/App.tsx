import ArrayVisualizer from "./components/array-visualizer"
import { TooltipProvider } from "./components/ui/tooltip"

function App() {
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <ArrayVisualizer />
      </div>
    </TooltipProvider>
  )
}

export default App
