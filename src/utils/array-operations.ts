import type { AnimationState } from "@/types/array-operations";

type CaptureStateProps = {
    data: AnimationState
}

export function captureState({ data }: CaptureStateProps): AnimationState {
    return {
        array: [...data.array], // Always create a copy
        highlightIndices: [...data.highlightIndices],
        operation: data.operation,
        arrowPosition: data.arrowPosition,
        arrowLabel: data.arrowLabel,
        message: data.message,
    }
}

type HandleOperationProps = {
    operation: "push" | "pop" | "slice" | "find" | "splice",
    index?: number,
    value?: number,
    array: number[]
}

export function handleOperation({ array, operation, index, value }: HandleOperationProps): AnimationState[] {
    let operations: AnimationState[] = [];
    let workingArray = [...array]; // Working copy

    switch (operation) {
        case 'push':
            if (value !== undefined) {
                // Step 1: Show where we're about to insert
                operations.push(captureState({
                    data: {
                        array: [...workingArray],
                        highlightIndices: [],
                        message: `Pushing ${value} to the end of array`,
                        operation: "push",
                        arrowPosition: workingArray.length,
                        arrowLabel: "insert here",
                    }
                }));

                // Step 2: Perform push
                workingArray.push(value);

                // Step 3: Show after insertion with highlight
                operations.push(captureState({
                    data: {
                        array: [...workingArray],
                        highlightIndices: [workingArray.length - 1],
                        message: `Pushed ${value} at index ${workingArray.length - 1}`,
                        operation: "push",
                        arrowPosition: workingArray.length - 1,
                        arrowLabel: "new element",
                    }
                }));
            }
            break;

        case 'pop':
            if (workingArray.length === 0) {
                operations.push(captureState({
                    data: {
                        array: [...workingArray],
                        highlightIndices: [],
                        message: "Cannot pop from empty array",
                        operation: "pop",
                    }
                }));
            } else {
                // Step 1: Highlight element to be removed
                const lastIndex = workingArray.length - 1;
                const valueToRemove = workingArray[lastIndex];

                operations.push(captureState({
                    data: {
                        array: [...workingArray],
                        highlightIndices: [lastIndex],
                        message: `Popping last element: ${valueToRemove}`,
                        operation: "pop",
                        arrowPosition: lastIndex,
                        arrowLabel: "removing",
                    }
                }));

                // Step 2: Perform pop
                workingArray.pop();

                // Step 3: Show result
                operations.push(captureState({
                    data: {
                        array: [...workingArray],
                        highlightIndices: [],
                        message: `Popped ${valueToRemove}. New length: ${workingArray.length}`,
                        operation: "pop",
                    }
                }));
            }
            break;

        case 'find':
            if (value !== undefined) {
                // Step 1: Start searching
                operations.push(captureState({
                    data: {
                        array: [...workingArray],
                        highlightIndices: [],
                        message: `Searching for ${value}...`,
                        operation: "find",
                    }
                }));

                // Step 2-N: Check each element
                let foundIndex = -1;
                for (let i = 0; i < workingArray.length; i++) {
                    operations.push(captureState({
                        data: {
                            array: [...workingArray],
                            highlightIndices: [i],
                            message: `Checking index ${i}: ${workingArray[i]} ${workingArray[i] === value ? '===' : '!=='} ${value}`,
                            operation: "find",
                            arrowPosition: i,
                            arrowLabel: "checking",
                        }
                    }));

                    if (workingArray[i] === value) {
                        foundIndex = i;
                        break;
                    }
                }

                // Final step: Show result
                if (foundIndex !== -1) {
                    operations.push(captureState({
                        data: {
                            array: [...workingArray],
                            highlightIndices: [foundIndex],
                            message: `Found ${value} at index ${foundIndex}!`,
                            operation: "find",
                            arrowPosition: foundIndex,
                            arrowLabel: "found!",
                        }
                    }));
                } else {
                    operations.push(captureState({
                        data: {
                            array: [...workingArray],
                            highlightIndices: [],
                            message: `${value} not found in array`,
                            operation: "find",
                        }
                    }));
                }
            }
            break;

        case 'slice':
            if (index !== undefined && value !== undefined) {
                const start = index;
                const end = value;

                // Validation
                if (start < 0 || end > workingArray.length || start > end) {
                    operations.push(captureState({
                        data: {
                            array: [...workingArray],
                            highlightIndices: [],
                            message: `Invalid slice range: [${start}, ${end})`,
                            operation: "slice",
                        }
                    }));
                    break;
                }

                // Step 1: Show the range
                const highlightRange = Array.from(
                    { length: end - start },
                    (_, i) => start + i
                );

                operations.push(captureState({
                    data: {
                        array: [...workingArray],
                        highlightIndices: highlightRange,
                        message: `Slicing from index ${start} to ${end} (exclusive)`,
                        operation: "slice",
                        arrowPosition: start,
                        arrowLabel: "start",
                    }
                }));

                // Step 2: Show result
                const slicedArray = workingArray.slice(start, end);

                operations.push(captureState({
                    data: {
                        array: slicedArray,
                        highlightIndices: Array.from({ length: slicedArray.length }, (_, i) => i),
                        message: `Sliced result: [${slicedArray.join(', ')}]. Original array unchanged.`,
                        operation: "slice",
                    }
                }));

                // Step 3: Show original array is unchanged
                operations.push(captureState({
                    data: {
                        array: [...workingArray],
                        highlightIndices: [],
                        message: `Original array: [${workingArray.join(', ')}] (unchanged)`,
                        operation: "slice",
                    }
                }));
            }
            break;

        case 'splice':
            if (index !== undefined) {
                // splice(index, deleteCount, value?)
                const deleteCount = value !== undefined ? 1 : 1; // For simplicity, delete 1 element
                const insertValue = value;

                // Validation
                if (index < 0 || index >= workingArray.length) {
                    operations.push(captureState({
                        data: {
                            array: [...workingArray],
                            highlightIndices: [],
                            message: `Invalid index: ${index}`,
                            operation: "splice",
                        }
                    }));
                    break;
                }

                // Step 1: Show what we're splicing
                operations.push(captureState({
                    data: {
                        array: [...workingArray],
                        highlightIndices: [index],
                        message: insertValue !== undefined
                            ? `Splicing at index ${index}: replacing ${workingArray[index]} with ${insertValue}`
                            : `Splicing at index ${index}: removing ${workingArray[index]}`,
                        operation: "splice",
                        arrowPosition: index,
                        arrowLabel: "splice here",
                    }
                }));

                // Step 2: Perform splice
                const removed = workingArray.splice(
                    index,
                    deleteCount,
                    ...(insertValue !== undefined ? [insertValue] : [])
                );

                // Step 3: Show result
                operations.push(captureState({
                    data: {
                        array: [...workingArray],
                        highlightIndices: [index],
                        message: insertValue !== undefined
                            ? `Replaced ${removed[0]} with ${insertValue}. Elements ${index > 0 ? 'after shifted' : ''}`
                            : `Removed ${removed[0]}. Elements after index ${index} shifted left`,
                        operation: "splice",
                        arrowPosition: index,
                        arrowLabel: "modified",
                    }
                }));

                // Step 4: Show final state
                operations.push(captureState({
                    data: {
                        array: [...workingArray],
                        highlightIndices: [],
                        message: `Splice complete. New array: [${workingArray.join(', ')}]`,
                        operation: "splice",
                    }
                }));
            }
            break;

        default:
            operations.push(captureState({
                data: {
                    array: [...workingArray],
                    highlightIndices: [],
                    message: `Unknown operation: ${operation}`,
                    operation: operation,
                }
            }));
    }

    return operations;
}