"use client"

import { useCallback, useSyncExternalStore } from 'react'
import { useTheme } from 'next-themes'
import {
  ReactFlow,
  // MiniMap,
  Controls,
  // Background,
  addEdge,
  useEdgesState,
  useNodesState,
  type Connection,
  type Edge,
  type ColorMode,
  ConnectionLineType,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import { StepNode } from '@/features/workflows/components/step-node'
import type { StepNodeType } from '@/features/workflows/nodes/node-registry'

const nodeTypes = {
  step: StepNode,
}

const initialNodes: StepNodeType[] = [
  {
    id: '1',
    type: 'step',
    position: { x: 0, y: 0 },
    data: {
      type: 'start',
      kind: 'trigger',
      title: 'Start',
      values: {},
    },
  },
  // {
  //   id: 'open-url',
  //   type: "step",
  //   position: { x: 0, y: 150 },
  //   data: {
  //     type: 'open-url',
  //     kind: 'action',
  //     title: 'Open URL',
  //     values: { },
  //   }
  // }
]

const initialEdges : Edge[] = []

function useMounted(){
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export default function Canvas() {
  const { resolvedTheme } = useTheme()
  const mounted = useMounted()

  const colorMode: ColorMode = mounted
    ?(resolvedTheme as ColorMode) ?? "light"
    : "light"

  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgeChange] = useEdgesState(initialEdges)

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  )

  return (
    <div className="size-full">
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgeChange}
        onConnect={onConnect}
        colorMode={colorMode}
        fitView
        connectionLineType={ConnectionLineType.SmoothStep}
        connectionLineStyle={{ stroke: 'var(--border)' }}
        defaultEdgeOptions={{ 
            type: "smoothstep", style: { stroke: 'var(--border)' },
        }}
        style={
            {
                "--xy-background-color": "var(--background)",
                "--xy-edge-stroke-width": 2,
                "--xy-connectionline-stroke-width": 2,
            } as React.CSSProperties
        }
        maxZoom={1}
      >
        {/* <Background /> */}
        <Controls />
        {/* <MiniMap /> */}
      </ReactFlow>
    </div>
  )
}