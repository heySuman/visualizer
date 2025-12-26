import type { AnimationState } from "@/types/array-operations"

type ArrayVisualizationProps = {
    state: AnimationState | null | undefined
}

export function ArrayVisualization({ state }: ArrayVisualizationProps) {

    const BLOCK_WIDTH = 20;
    const BLOCK_HEIGHT = 20;
    const GAP = 15;
    const START_X = 50;
    const BLOCK_Y = 80;
    const SVG_HEIGHT = 350;
    const ARROW_GAP = 20;
    const ARROW_HEAD_Y = BLOCK_Y + BLOCK_HEIGHT + ARROW_GAP;

    if (!state) {
        return null
    }

    const { array, highlightIndices, arrowPosition, arrowLabel, message } = state;

    const svgWidth = Math.max(
        500,
        START_X * 2 + array.length * (BLOCK_WIDTH + GAP)
    );

    const getBlockX = (index: number) => START_X + index * (BLOCK_WIDTH + GAP);

    return (
        <div className="border rounded-2xl">
            <svg
                viewBox={`0 0 ${svgWidth} ${SVG_HEIGHT}`}
                style={{ minHeight: '350px' }}
            >
                {array.map((value, index) => {
                    const x = getBlockX(index);
                    const isHighlight = highlightIndices.includes(index);

                    return (
                        <g key={`block-${index}-${value}`}>
                            <rect
                                x={x}
                                y={BLOCK_Y}
                                width={BLOCK_WIDTH}
                                height={BLOCK_HEIGHT}
                                strokeWidth="0.5"
                                className={`${isHighlight ? 'fill-primary' : 'fill-secondary'} rounded-2xl stroke-primary/50`}
                                rx={1}
                            />

                            <text
                                x={x + BLOCK_WIDTH / 2}
                                y={BLOCK_Y + BLOCK_HEIGHT / 2 + 4}
                                textAnchor="middle"
                                fill={isHighlight ? "white" : "black"}
                                fontSize="10"
                            >
                                {value}
                            </text>

                            <text
                                x={x + BLOCK_WIDTH / 2}
                                y={BLOCK_Y + BLOCK_HEIGHT + 15}
                                textAnchor="middle"
                                fill="#94a3b8"
                                fontSize="8"
                            >
                                {index}
                            </text>
                        </g>
                    );
                })}

                {arrowPosition !== undefined && (
                    <g
                        style={{
                            transform: `translateX(${getBlockX(arrowPosition) + BLOCK_WIDTH / 2 - 30}px)`,
                            transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                    >
                        <line
                            x1="30"
                            y1={ARROW_HEAD_Y + 8}
                            x2="30"
                            y2={ARROW_HEAD_Y + 30}
                            strokeWidth="1"
                            className="stroke-primary"
                        />

                        <path
                            d={`
                                M 30 ${ARROW_HEAD_Y}
                                L 27 ${ARROW_HEAD_Y + 8}
                                L 33 ${ARROW_HEAD_Y + 8}
                                Z
                            `}
                            className="fill-primary"
                        />

                        <text
                            x="30"
                            y={ARROW_HEAD_Y + 45}
                            textAnchor="middle"
                            fontSize="8"
                            className="fill-primary"
                        >
                            {arrowLabel}
                        </text>
                    </g>
                )}

                <g>
                    <rect
                        x="20"
                        y={ARROW_HEAD_Y + 20}
                        width={svgWidth - 40}
                        height="50"
                        rx="4"
                        className="stroke-primary fill-gray-400"
                        strokeWidth="1"
                    />

                    <text x="40" y={ARROW_HEAD_Y + 40} fontSize="8" fontWeight="600">
                        OPERATION:
                    </text>

                    <text x="40" y={ARROW_HEAD_Y + 50} fill="#e2e8f0" fontSize="8" fontWeight="500">
                        {message}
                    </text>
                </g>
            </svg>
        </div>)
}