import { useEffect, useState } from "react";
import type { AnimationState } from "@/types/array-operations";

type ArrayVisualizationControlProps = {
    speed?: number;
}

/**
 * Provides the control for the basic array operations visualization
 * @param history - Array of animation states
 * @param speed - Animation interval in milliseconds (default: 1000)
 * @returns Control functions and current state
 */
export function useArrayVisualizationControl({
    speed = 1000
}: ArrayVisualizationControlProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [history, setHistory] = useState<AnimationState[]>([])
    const [activeIndex, setActiveIndex] = useState<number>(0);

    useEffect(() => {
        if (!isPlaying) return;

        if (activeIndex >= history.length - 1) {
            setIsPlaying(false);
            return;
        }

        const interval = setInterval(() => {
            setActiveIndex(prev => {
                if (prev >= history.length - 1) {
                    setIsPlaying(false);
                    return prev;
                }
                return prev + 1;
            });
        }, speed);

        return () => clearInterval(interval);
    }, [isPlaying, activeIndex, history.length, speed]);

    const currentStep = history[activeIndex] || null;

    function handleNext() {
        if (activeIndex < history.length - 1) {
            setActiveIndex(prev => prev + 1);
        }
    }

    function handleBack() {
        if (activeIndex > 0) {
            setActiveIndex(prev => prev - 1);
        }
    }

    function handlePause() {
        setIsPlaying(false);
    }

    function handleResume() {
        setIsPlaying(true);
    }

    function handleReset() {
        setActiveIndex(0);
        setIsPlaying(false);
    }

    return {
        isPlaying,
        currentStep,
        activeIndex,
        totalSteps: history.length,
        handlePause,
        handleBack,
        handleNext,
        handleResume,
        handleReset,
        setHistory,
        history,
    };
}