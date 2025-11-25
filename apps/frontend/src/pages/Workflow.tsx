import { useState, useCallback } from 'react';

import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, 
    type Node, 
    type Edge, 
    type Connection, 
    Background, 
    MiniMap, 
    Controls, 
    BackgroundVariant, 
    Position } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Sidebar } from '../components/Sidebar';
import { Tabbar } from '../components/Tabbar';
import { Sidepanel } from '../components/Sidepanel';
import { ManualTrigger } from '../components/triggers/ManualTrigger';
import { WebhookTrigger } from '../components/triggers/WebhookTrigger';
import { ResendNode } from '../components/nodes/ResendNode';
import { TelegramNode } from '../components/nodes/TelegramNode';
import { GeminiNode } from '../components/nodes/GeminiNode';


const noteTypes = {
  manual: ManualTrigger,
  webhook: WebhookTrigger,
  resend: ResendNode,
  telegram: TelegramNode,
  gemini: GeminiNode
}

export function Workflow() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  

  const onNodesChange = useCallback(
    (changes: any) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes: any) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );
  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );

  //function to add node from side panel
  const addNode = (type:string) => {
    const id = crypto.randomUUID();

    const newNode = {
      id,
      type,
      position: {x: Math.random()*200, 
                 y: Math.random()*300}, 
      data: {label: `${type} node`}
    };
    setNodes((prev) => [...prev, newNode])
  }
  return (
    <div >
      <Tabbar />
      <div className='flex overflow-auto'>
        <Sidebar />
        <div className='h-[calc(100vh-3.5rem)] w-screen pr-12 mt-14 bg-nback'>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={noteTypes}
            fitView
          >
            <Background variant={BackgroundVariant.Cross} gap={14} size={1} />
            <MiniMap zoomable pannable nodeStrokeWidth={3} bgColor='gray'/>
            <Controls />
          </ReactFlow>
        </div>
        <div>
          <Sidepanel onAddNode={addNode} />
        </div>
      </div>
    </div>
  );
}