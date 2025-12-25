import { useState } from "react"
import { Button } from "./ui/button"
import { handleOperation } from "@/utils/array-operations"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"
import { useArrayVisualizationControl } from "@/hooks/use-array-visualization"
import { Play, ArrowRightToLine, ArrowLeftToLine, Pause, RotateCcw } from "lucide-react"
import { ArrayVisualization } from "./array-visualization"

export default function ArrayVisualizer() {

    const [array, setArray] = useState<number[]>([2, 22, 56])
    const { history, activeIndex, handleBack, handlePause, handleReset, handleNext, handleResume, setHistory } = useArrayVisualizationControl({ speed: 1000 })

    const executeOperation = (operation: "push" | "pop" | "slice" | "find" | "splice", index?: number, value?: number) => {
        const animationSteps = handleOperation({
            array,
            operation,
            index,
            value
        })

        setHistory(animationSteps);

        if (operation !== 'slice' && animationSteps.length > 0) {
            const finalState = animationSteps[animationSteps.length - 1];
            setArray([...finalState.array]);
        }
    }

    return (
        <section className="max-w-lg mx-auto">
            <div className="flex justify-center p-4 gap-4">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant={"outline"} size={"icon-lg"} onClick={handleBack}><ArrowLeftToLine /></Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Go to previous step</p>
                    </TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant={"outline"} size={"icon-lg"} onClick={handlePause}><Play /></Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Play</p>
                    </TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant={"outline"} size={"icon-lg"} onClick={handleResume}><Pause /></Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Resume</p>
                    </TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant={"outline"} size={"icon-lg"} onClick={handleNext}><ArrowRightToLine /></Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Go to next step</p>
                    </TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant={"outline"} size={"icon-lg"} onClick={handleReset}><RotateCcw /></Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Restart</p>
                    </TooltipContent>
                </Tooltip>
            </div>

            <div>
                {/* Visualization */}
                <ArrayVisualization state={history[activeIndex]} />

                {/* Controls */}
                <button onClick={() => executeOperation('push', undefined, 60)}>
                    Push 60
                </button>
                <button onClick={() => executeOperation('pop')}>
                    Pop
                </button>
                <button onClick={() => executeOperation('find', undefined, 30)}>
                    Find 30
                </button>
                <button onClick={() => executeOperation('slice', 1, 4)}>
                    Slice [1:4]
                </button>
                <button onClick={() => executeOperation('splice', 2, 99)}>
                    Splice at 2
                </button>
            </div>

        </section>
    )
}