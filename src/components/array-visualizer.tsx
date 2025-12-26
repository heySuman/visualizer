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
    const { history, activeIndex, isPlaying, handleBack, handlePause, handleReset, handleNext, handleResume, setHistory } = useArrayVisualizationControl({ speed: 1000 })
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
                <div className="text-center space-y-6">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-bold tracking-tight">Array Visualizer</h1>
                        <p className="text-muted-foreground text-lg">Visualize and understand array operations</p>
                    </div>
                    <Button size="lg" onClick={handleStart} className="gap-2">
                        <PlayCircle className="w-5 h-5" />
                        Start Visualization
                    </Button>
                </div>
            </section>
        )
    }

    return (
        <section className="max-w-7xl mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Basic array operations</h1>
                <Button variant="outline" onClick={resetVisualization}>Exit</Button>
            </div>

            {/* Playback Controls */}
            <div className="flex justify-center gap-2 p-4 rounded-lg">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon-lg"
                            onClick={handleBack}
                            disabled={activeIndex === 0 || isPlaying}
                        >
                            <ArrowLeftToLine className="w-4 h-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Previous Step</TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon-lg"
                            onClick={handleResume}
                            disabled={isPlaying || activeIndex >= history.length - 1}
                        >
                            <Play className="w-4 h-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Play</TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon-lg"
                            onClick={handlePause}
                            disabled={!isPlaying}
                        >
                            <Pause className="w-4 h-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Pause</TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon-lg"
                            onClick={handleNext}
                            disabled={activeIndex >= history.length - 1 || isPlaying}
                        >
                            <ArrowRightToLine className="w-4 h-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Next Step</TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon-lg"
                            onClick={handleReset}
                            disabled={isPlaying}
                        >
                            <RotateCcw className="w-4 h-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Reset</TooltipContent>
                </Tooltip>
            </div>


            <div className="space-y-4">
                <div className="flex justify-center items-center gap-3">
                    <Button
                        size="lg"
                        variant={selectedOperation === "push" ? "default" : "secondary"}
                        onClick={() => handleOperationClick('push')}
                        disabled={isPlaying}
                    >
                        Push
                    </Button>
                    <Button
                        size="lg"
                        variant={selectedOperation === "pop" ? "default" : "secondary"}
                        onClick={() => handleOperationClick('pop')}
                        disabled={isPlaying || array.length === 0}
                    >
                        Pop
                    </Button>
                    <Button
                        size="lg"
                        variant={selectedOperation === "find" ? "default" : "secondary"}
                        onClick={() => handleOperationClick('find')}
                        disabled={isPlaying || array.length === 0}
                    >
                        Find
                    </Button>
                    <Button
                        size="lg"
                        variant={selectedOperation === "slice" ? "default" : "secondary"}
                        onClick={() => handleOperationClick('slice')}
                        disabled={isPlaying || array.length === 0}
                    >
                        Slice
                    </Button>
                    <Button
                        size="lg"
                        variant={selectedOperation === "splice" ? "default" : "secondary"}
                        onClick={() => handleOperationClick('splice')}
                        disabled={isPlaying || array.length === 0}
                    >
                        Splice
                    </Button>
                </div>
            </div>

            {/* Input Panel */}
            {selectedOperation && (
                <div className="rounded-lg p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <Button variant="secondary" size="sm" onClick={handleCancel}>Cancel</Button>
                    </div>

                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-3">
                        {selectedOperation === 'push' && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Value to push:</label>
                                <Input
                                    type="number"
                                    placeholder="Enter a number"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                                />
                            </div>
                        )}

                        {selectedOperation === 'pop' && (
                            <p className="text-sm text-muted-foreground">
                                This will remove the last element from the array.
                            </p>
                        )}

                        {selectedOperation === 'find' && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Value to find:</label>
                                <Input
                                    type="number"
                                    placeholder="Enter a number"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                                />
                            </div>
                        )}

                        {selectedOperation === 'slice' && (
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Start index:</label>
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        value={inputIndex}
                                        onChange={(e) => setInputIndex(e.target.value)}
                                        min="0"
                                        max={array.length.toString()}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">End index (exclusive):</label>
                                    <Input
                                        type="number"
                                        placeholder={array.length.toString()}
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                                        min="0"
                                        max={array.length.toString()}
                                    />
                                </div>
                            </div>
                        )}

                        {selectedOperation === 'splice' && (
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Index:</label>
                                    <Input
                                        type="number"
                                        placeholder="Enter index"
                                        value={inputIndex}
                                        onChange={(e) => setInputIndex(e.target.value)}
                                        min="0"
                                        max={(array.length - 1).toString()}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">New value (optional):</label>
                                    <Input
                                        type="number"
                                        placeholder="Leave empty to delete"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <Button onClick={handleSubmit} className="w-full">
                        Execute {selectedOperation}
                    </Button>
                </div>
            )}

            <ArrayVisualization state={history[activeIndex]} />
        </section>
    )
}