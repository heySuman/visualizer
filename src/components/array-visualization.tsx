import type { AnimationState } from "@/types/array-operations"

type ArrayVisualizationProps = {
    state: AnimationState | null | undefined
}

export function ArrayVisualization({ state }: ArrayVisualizationProps) {

    const BLOCK_WIDTH = 70;
    const BLOCK_HEIGHT = 60;
    const GAP = 15;
    const START_X = 50;
    const BLOCK_Y = 80;
    const SVG_HEIGHT = 350;

    if (!state) {
        return (
            <div className="bg-slate-800/50 rounded-2xl p-8 backdrop-blur border border-slate-700">
                <svg
                    viewBox={`0 0 ${START_X * 2 + BLOCK_WIDTH} ${SVG_HEIGHT}`}
                    className="w-full"
                    style={{ minHeight: '350px' }}
                >
                    <text
                        x="50%"
                        y="50%"
                        textAnchor="middle"
                        fill="#94a3b8"
                        fontSize="18"
                        fontWeight="500"
                    >
                        Execute an operation to start visualization
                    </text>
                </svg>
            </div>
        )
    }


    const { array, highlightIndices, arrowPosition, arrowLabel, message } = state;

    // Calculate SVG width based on array length
    const svgWidth = Math.max(
        800,
        START_X * 2 + array.length * (BLOCK_WIDTH + GAP)
    );

    const getBlockX = (index: number) => START_X + index * (BLOCK_WIDTH + GAP);

    return (
        <div className="bg-slate-800/50 rounded-2xl p-8 backdrop-blur border border-slate-700">
            <svg
                viewBox={`0 0 ${svgWidth} ${SVG_HEIGHT}`}
                className="w-full"
                style={{ minHeight: '350px' }}
            >
                {/* Array Blocks */}
                {array.map((value, index) => {
                    const x = getBlockX(index);
                    const isHighlight = highlightIndices.includes(index);

                    return (
                        <g key={`block-${index}-${value}`}>
                            {/* Shadow */}
                            <rect
                                x={x + 2}
                                y={BLOCK_Y + 2}
                                width={BLOCK_WIDTH}
                                height={BLOCK_HEIGHT}
                                rx="10"
                                fill="rgba(0,0,0,0.3)"
                            />

                            {/* Block */}
                            <rect
                                x={x}
                                y={BLOCK_Y}
                                width={BLOCK_WIDTH}
                                height={BLOCK_HEIGHT}
                                rx="10"
                                fill={isHighlight ? '#3b82f6' : '#475569'}
                                stroke={isHighlight ? '#60a5fa' : '#64748b'}
                                strokeWidth="2"
                                style={{
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    filter: isHighlight
                                        ? 'drop-shadow(0 4px 12px rgba(59, 130, 246, 0.6))'
                                        : 'none',
                                }}
                            />

                            {/* Value */}
                            <text
                                x={x + BLOCK_WIDTH / 2}
                                y={BLOCK_Y + BLOCK_HEIGHT / 2 + 6}
                                textAnchor="middle"
                                fill="white"
                                fontSize="24"
                                fontWeight="bold"
                                fontFamily="monospace"
                            >
                                {value}
                            </text>

                            {/* Index Label */}
                            <text
                                x={x + BLOCK_WIDTH / 2}
                                y={BLOCK_Y + BLOCK_HEIGHT + 25}
                                textAnchor="middle"
                                fill="#94a3b8"
                                fontSize="14"
                                fontFamily="monospace"
                            >
                                {index}
                            </text>
                        </g>
                    );
                })}

                {/* Arrow */}
                {arrowPosition !== undefined && (
                    <g
                        style={{
                            transform: `translateX(${getBlockX(arrowPosition) + BLOCK_WIDTH / 2 - 30
                                }px)`,
                            transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                    >
                        {/* Arrow shaft */}
                        <line
                            x1="30"
                            y1="200"
                            x2="30"
                            y2="165"
                            stroke="#ef4444"
                            strokeWidth="3"
                        />

                        {/* Arrow head */}
                        <path d="M 30 160 L 25 170 L 35 170 Z" fill="#ef4444" />

                        {/* Label background */}
                        <rect
                            x="0"
                            y="210"
                            width="60"
                            height="30"
                            rx="6"
                            fill="#1e293b"
                            stroke="#ef4444"
                            strokeWidth="2"
                        />

                        {/* Label text */}
                        <text
                            x="30"
                            y="230"
                            textAnchor="middle"
                            fill="#ef4444"
                            fontSize="12"
                            fontWeight="600"
                        >
                            {arrowLabel}
                        </text>
                    </g>
                )}

                {/* Operation Display */}
                <g>
                    <rect
                        x="20"
                        y="270"
                        width={svgWidth - 40}
                        height="60"
                        rx="8"
                        fill="#1e293b"
                        stroke="#334155"
                        strokeWidth="2"
                    />

                    <text x="40" y="295" fill="#94a3b8" fontSize="14" fontWeight="600">
                        OPERATION:
                    </text>

                    <text x="40" y="318" fill="#e2e8f0" fontSize="18" fontWeight="500">
                        {message}
                    </text>
                </g>
            </svg>
        </div>)
}