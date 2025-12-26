import { useState } from "react"
import { Button } from "./ui/button"
import { handleOperation } from "@/utils/array-operations"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"
import { useArrayVisualizationControl } from "@/hooks/use-array-visualization"
import { Play, ArrowRightToLine, ArrowLeftToLine, Pause, RotateCcw, PlayCircle } from "lucide-react"
import { ArrayVisualization } from "./array-visualization"
import { Input } from "./ui/input"
import { Alert, AlertDescription } from "./ui/alert"

type OperationType = "push" | "pop" | "slice" | "find" | "splice";

export default function ArrayVisualizer() {
    const [array, setArray] = useState<number[]>([])
    const [isStarted, setIsStarted] = useState(false)
    const [speed, setSpeed] = useState(800)
    const { history, activeIndex, isPlaying, handleBack, handlePause, handleReset, handleNext, handleResume, setHistory, setSpeed: setAnimationSpeed } = useArrayVisualizationControl({ speed })
    const [selectedOperation, setSelectedOperation] = useState<OperationType | null>(null)

    // Input state for operations
    const [inputValue, setInputValue] = useState<string>('')
    const [inputIndex, setInputIndex] = useState<string>('')
    const [error, setError] = useState<string>('')

    const handleStart = () => {
        const initialArray = [5, 12, 8, 23, 16]
        setArray(initialArray)
        setIsStarted(true)
        setHistory([{
            array: initialArray,
            highlightIndices: [],
            message: "Array initialized. Select an operation to begin.",
            operation: "init"
        }])
    }

    const resetVisualization = () => {
        setIsStarted(false)
        setArray([])
        setHistory([])
        setSelectedOperation(null)
        setInputValue('')
        setInputIndex('')
        setError('')
    }

    const executeOperation = (operation: OperationType, index?: number, value?: number) => {
        setError('')

        try {
            const animationSteps = handleOperation({
                array,
                operation,
                index,
                value
            })

            if (animationSteps.length === 0) {
                setError('Operation failed. Please check your inputs.')
                return
            }

            setHistory(animationSteps)

            // Auto-play the animation after setting history
            setTimeout(() => {
                handleResume()
            }, 100)

            if (operation !== 'slice' && animationSteps.length > 0) {
                const finalState = animationSteps[animationSteps.length - 1]
                setArray([...finalState.array])
            }

            setSelectedOperation(null)
            setInputValue('')
            setInputIndex('')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred')
        }
    }

    const handleOperationClick = (operation: OperationType) => {
        if (!isStarted) return
        setError('')
        setSelectedOperation(operation)
        setInputValue('')
        setInputIndex('')
    }

    const handleSubmit = () => {
        if (!selectedOperation) return

        switch (selectedOperation) {
            case 'push': {
                const value = parseInt(inputValue)
                if (isNaN(value)) {
                    setError('Please enter a valid number')
                    return
                }
                executeOperation('push', undefined, value)
                break
            }
            case 'pop': {
                executeOperation('pop')
                break
            }
            case 'find': {
                const value = parseInt(inputValue)
                if (isNaN(value)) {
                    setError('Please enter a valid number to find')
                    return
                }
                executeOperation('find', undefined, value)
                break
            }
            case 'slice': {
                const start = parseInt(inputIndex)
                const end = parseInt(inputValue)
                if (isNaN(start) || isNaN(end)) {
                    setError('Please enter valid start and end indices')
                    return
                }
                if (start < 0 || end > array.length || start >= end) {
                    setError(`Invalid range. Array length is ${array.length}`)
                    return
                }
                executeOperation('slice', start, end)
                break
            }
            case 'splice': {
                const index = parseInt(inputIndex)
                const value = inputValue ? parseInt(inputValue) : undefined
                if (isNaN(index) || index < 0 || index >= array.length) {
                    setError(`Invalid index. Must be between 0 and ${array.length - 1}`)
                    return
                }
                if (inputValue && isNaN(value!)) {
                    setError('Please enter a valid number or leave empty to delete')
                    return
                }
                executeOperation('splice', index, value)
                break
            }
        }
    }

    const handleCancel = () => {
        setSelectedOperation(null)
        setInputValue('')
        setInputIndex('')
        setError('')
    }

    // Show empty state before start
    if (!isStarted) {
        return (
            <section className="min-h-screen flex items-center justify-center p-4">
                <div className="text-center space-y-8 max-w-2xl">
                    <div className="space-y-4">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg mb-4">
                            <PlayCircle className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                            Array Operations Visualizer
                        </h1>
                        <p className="text-muted-foreground text-lg max-w-md mx-auto">
                            Learn and visualize how array methods work with interactive step-by-step animations
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            <span>Push & Pop</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            <span>Find Elements</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            <span>Slice & Splice</span>
                        </div>
                    </div>

                    <Button
                        size="lg"
                        onClick={handleStart}
                        className="gap-2 text-base px-8 py-6 shadow-lg hover:shadow-xl transition-all"
                    >
                        <PlayCircle className="w-5 h-5" />
                        Start Visualization
                    </Button>
                </div>
            </section>
        )
    }

    return (
        <section className="max-w-7xl mx-auto p-4 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-3">
                <div>
                    <h1 className="text-xl font-bold">Array Operations Visualizer</h1>
                    <p className="text-sm text-muted-foreground">Interactive array manipulation and visualization</p>
                </div>
                <Button variant="outline" size="sm" onClick={resetVisualization}>Exit</Button>
            </div>

            {/* Visualization Area */}
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-lg border shadow-sm">
                <ArrayVisualization state={history[activeIndex]} />
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-center gap-3 py-2">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleReset}
                            disabled={isPlaying || activeIndex === 0}
                            className="h-8 w-8"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Reset</TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleBack}
                            disabled={activeIndex === 0 || isPlaying}
                            className="h-8 w-8"
                        >
                            <ArrowLeftToLine className="w-3.5 h-3.5" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Previous</TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant={isPlaying ? "secondary" : "default"}
                            size="icon"
                            onClick={isPlaying ? handlePause : handleResume}
                            disabled={activeIndex >= history.length - 1 && !isPlaying}
                            className="h-9 w-9"
                        >
                            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>{isPlaying ? 'Pause' : 'Play'}</TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleNext}
                            disabled={activeIndex >= history.length - 1 || isPlaying}
                            className="h-8 w-8"
                        >
                            <ArrowRightToLine className="w-3.5 h-3.5" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Next</TooltipContent>
                </Tooltip>

                <div className="flex items-center gap-2 ml-2">
                    <div className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded">
                        {activeIndex + 1} / {history.length}
                    </div>

                    <div className="flex items-center gap-2 border-l pl-3">
                        <span className="text-xs text-muted-foreground whitespace-nowrap">Speed:</span>
                        <input
                            type="range"
                            min="300"
                            max="2000"
                            step="100"
                            value={speed}
                            onChange={(e) => {
                                const newSpeed = parseInt(e.target.value)
                                setSpeed(newSpeed)
                                setAnimationSpeed(newSpeed)
                            }}
                            className="w-20 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            disabled={isPlaying}
                        />
                        <span className="text-xs text-muted-foreground w-8 text-right">
                            {speed < 600 ? '2x' : speed < 1000 ? '1.5x' : speed < 1500 ? '1x' : '0.5x'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Operations Panel */}
            <div className="border rounded-lg p-4 bg-white dark:bg-slate-950">
                <h2 className="text-sm font-semibold mb-3">Operations</h2>

                {error && (
                    <Alert variant="destructive" className="mb-3">
                        <AlertDescription className="text-xs">{error}</AlertDescription>
                    </Alert>
                )}

                {/* Operation Buttons and Inline Inputs */}
                <div className="flex flex-wrap gap-2">
                    {/* Push Operation */}
                    <div className="flex items-center gap-1.5">
                        <Button
                            size="sm"
                            variant={selectedOperation === "push" ? "default" : "secondary"}
                            onClick={() => handleOperationClick('push')}
                            disabled={isPlaying}
                            className="h-8"
                        >
                            Push
                        </Button>
                        {selectedOperation === 'push' && (
                            <>
                                <Input
                                    type="number"
                                    placeholder="value"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                                    className="h-8 w-20 text-xs"
                                    autoFocus
                                />
                                <Button size="sm" onClick={handleSubmit} className="h-8 text-xs">Go</Button>
                                <Button size="sm" variant="ghost" onClick={handleCancel} className="h-8 text-xs">×</Button>
                            </>
                        )}
                    </div>

                    {/* Pop Operation */}
                    <div className="flex items-center gap-1.5">
                        <Button
                            size="sm"
                            variant={selectedOperation === "pop" ? "default" : "secondary"}
                            onClick={() => selectedOperation === 'pop' ? executeOperation('pop') : handleOperationClick('pop')}
                            disabled={isPlaying || array.length === 0}
                            className="h-8"
                        >
                            Pop
                        </Button>
                    </div>

                    {/* Find Operation */}
                    <div className="flex items-center gap-1.5">
                        <Button
                            size="sm"
                            variant={selectedOperation === "find" ? "default" : "secondary"}
                            onClick={() => handleOperationClick('find')}
                            disabled={isPlaying || array.length === 0}
                            className="h-8"
                        >
                            Find
                        </Button>
                        {selectedOperation === 'find' && (
                            <>
                                <Input
                                    type="number"
                                    placeholder="value"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                                    className="h-8 w-20 text-xs"
                                    autoFocus
                                />
                                <Button size="sm" onClick={handleSubmit} className="h-8 text-xs">Go</Button>
                                <Button size="sm" variant="ghost" onClick={handleCancel} className="h-8 text-xs">×</Button>
                            </>
                        )}
                    </div>

                    {/* Slice Operation */}
                    <div className="flex items-center gap-1.5">
                        <Button
                            size="sm"
                            variant={selectedOperation === "slice" ? "default" : "secondary"}
                            onClick={() => handleOperationClick('slice')}
                            disabled={isPlaying || array.length === 0}
                            className="h-8"
                        >
                            Slice
                        </Button>
                        {selectedOperation === 'slice' && (
                            <>
                                <Input
                                    type="number"
                                    placeholder="start"
                                    value={inputIndex}
                                    onChange={(e) => setInputIndex(e.target.value)}
                                    className="h-8 w-16 text-xs"
                                    autoFocus
                                />
                                <Input
                                    type="number"
                                    placeholder="end"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                                    className="h-8 w-16 text-xs"
                                />
                                <Button size="sm" onClick={handleSubmit} className="h-8 text-xs">Go</Button>
                                <Button size="sm" variant="ghost" onClick={handleCancel} className="h-8 text-xs">×</Button>
                            </>
                        )}
                    </div>

                    {/* Splice Operation */}
                    <div className="flex items-center gap-1.5">
                        <Button
                            size="sm"
                            variant={selectedOperation === "splice" ? "default" : "secondary"}
                            onClick={() => handleOperationClick('splice')}
                            disabled={isPlaying || array.length === 0}
                            className="h-8"
                        >
                            Splice
                        </Button>
                        {selectedOperation === 'splice' && (
                            <>
                                <Input
                                    type="number"
                                    placeholder="index"
                                    value={inputIndex}
                                    onChange={(e) => setInputIndex(e.target.value)}
                                    className="h-8 w-16 text-xs"
                                    autoFocus
                                />
                                <Input
                                    type="number"
                                    placeholder="value"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                                    className="h-8 w-16 text-xs"
                                />
                                <Button size="sm" onClick={handleSubmit} className="h-8 text-xs">Go</Button>
                                <Button size="sm" variant="ghost" onClick={handleCancel} className="h-8 text-xs">×</Button>
                            </>
                        )}
                    </div>
                </div>

                {/* Help Text */}
                <div className="mt-3 text-xs text-muted-foreground">
                    {!selectedOperation && "Select an operation to begin"}
                    {selectedOperation === 'push' && "Enter a value to add to the end of the array"}
                    {selectedOperation === 'pop' && "Click again to remove the last element"}
                    {selectedOperation === 'find' && "Enter a value to search in the array"}
                    {selectedOperation === 'slice' && "Enter start and end indices to extract a portion"}
                    {selectedOperation === 'splice' && "Enter index and optional value (leave empty to delete)"}
                </div>
            </div>
        </section>
    )
}