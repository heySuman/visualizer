import type { AnimationState } from "@/types/array-operations"

type ArrayVisualizationProps = {
    state: AnimationState | null | undefined
}

export function ArrayVisualization({ state }: ArrayVisualizationProps) {

    const BLOCK_WIDTH = 45;
    const BLOCK_HEIGHT = 45;
    const GAP = 8;
    const START_X = 50;
    const BLOCK_Y = 60;
    const SVG_HEIGHT = 280;
    const ARROW_GAP = 15;
    const ARROW_HEAD_Y = BLOCK_Y + BLOCK_HEIGHT + ARROW_GAP;

    if (!state) {
        return (
            <div className="flex items-center justify-center py-16">
                <p className="text-muted-foreground text-sm">No visualization data available</p>
            </div>
        )
    }

    const { array, highlightIndices, arrowPosition, arrowLabel, message } = state;

    const svgWidth = Math.max(
        600,
        START_X * 2 + array.length * (BLOCK_WIDTH + GAP)
    );

    const getBlockX = (index: number) => START_X + index * (BLOCK_WIDTH + GAP);

    return (
        <div className="p-4">
            <svg
                viewBox={`0 0 ${svgWidth} ${SVG_HEIGHT}`}
                style={{ minHeight: '280px' }}
                className="w-full"
            >
                {/* Array Elements */}
                {array.map((value, index) => {
                    const x = getBlockX(index);
                    const isHighlight = highlightIndices.includes(index);

                    return (
                        <g
                            key={`block-${index}-${value}`}
                            style={{
                                animation: 'fadeIn 0.3s ease-in-out'
                            }}
                        >
                            {/* Block */}
                            <rect
                                x={x}
                                y={BLOCK_Y}
                                width={BLOCK_WIDTH}
                                height={BLOCK_HEIGHT}
                                strokeWidth="2"
                                className={`${isHighlight
                                        ? 'fill-blue-500 stroke-blue-600'
                                        : 'fill-slate-100 dark:fill-slate-800 stroke-slate-300 dark:stroke-slate-600'
                                    }`}
                                rx="6"
                                style={{
                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                    filter: isHighlight ? 'drop-shadow(0 4px 6px rgba(59, 130, 246, 0.3))' : 'none'
                                }}
                            />

                            {/* Value Text */}
                            <text
                                x={x + BLOCK_WIDTH / 2}
                                y={BLOCK_Y + BLOCK_HEIGHT / 2 + 5}
                                textAnchor="middle"
                                className={`font-semibold ${isHighlight ? 'fill-white' : 'fill-slate-700 dark:fill-slate-200'}`}
                                fontSize="16"
                                style={{
                                    transition: 'fill 0.3s ease'
                                }}
                            >
                                {value}
                            </text>

                            {/* Index Label */}
                            <text
                                x={x + BLOCK_WIDTH / 2}
                                y={BLOCK_Y - 8}
                                textAnchor="middle"
                                fill="#94a3b8"
                                fontSize="11"
                                fontWeight="500"
                            >
                                [{index}]
                            </text>
                        </g>
                    );
                })}

                {/* Arrow Indicator */}
                {arrowPosition !== undefined && (
                    <g
                        style={{
                            transform: `translateX(${getBlockX(arrowPosition) + BLOCK_WIDTH / 2}px)`,
                            transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                            transformOrigin: 'center'
                        }}
                    >
                        {/* Arrow Line */}
                        <line
                            x1="0"
                            y1={ARROW_HEAD_Y + 12}
                            x2="0"
                            y2={ARROW_HEAD_Y + 35}
                            strokeWidth="2.5"
                            className="stroke-blue-500"
                            style={{
                                animation: 'bounce 1s ease-in-out infinite'
                            }}
                        />

                        {/* Arrow Head */}
                        <path
                            d={`
                                M 0 ${ARROW_HEAD_Y + 8}
                                L -5 ${ARROW_HEAD_Y + 15}
                                L 5 ${ARROW_HEAD_Y + 15}
                                Z
                            `}
                            className="fill-blue-500"
                            style={{
                                animation: 'bounce 1s ease-in-out infinite'
                            }}
                        />

                        {/* Arrow Label */}
                        {arrowLabel && (
                            <text
                                x="0"
                                y={ARROW_HEAD_Y + 52}
                                textAnchor="middle"
                                fontSize="11"
                                fontWeight="600"
                                className="fill-blue-600 dark:fill-blue-400"
                            >
                                {arrowLabel}
                            </text>
                        )}
                    </g>
                )}

                {/* Message Box */}
                <g>
                    <rect
                        x="20"
                        y={ARROW_HEAD_Y + 70}
                        width={svgWidth - 40}
                        height="50"
                        rx="8"
                        className="fill-blue-50 dark:fill-blue-950/50 stroke-blue-200 dark:stroke-blue-800"
                        strokeWidth="1.5"
                    />

                    <text
                        x="30"
                        y={ARROW_HEAD_Y + 88}
                        fontSize="10"
                        className="fill-blue-900 dark:fill-blue-100 font-medium uppercase tracking-wide"
                    >
                        Operation
                    </text>

                    <text
                        x="30"
                        y={ARROW_HEAD_Y + 105}
                        fontSize="13"
                        className="fill-blue-700 dark:fill-blue-300 font-medium"
                    >
                        {message}
                    </text>
                </g>
            </svg>

            {/* Add CSS animations */}
            <style>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes bounce {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-5px);
                    }
                }
            `}</style>
        </div>
    )
}