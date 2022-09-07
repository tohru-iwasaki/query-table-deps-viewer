import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import Split from 'react-split'
import ReactFlow, { Node, Edge, Background, Controls } from 'react-flow-renderer'

type Query = string

type FlowState = {
  nodes: Node[]
  edges: Edge[]
}

const createGraphFromQuery = (query: Query) => {
  const nodes: Node[] = []
  const edges: Edge[] = []
  const flow: FlowState = { nodes, edges }

  // TODO 一旦ダミーデータで作る。後で修正する
  nodes.push({
    id: '1',
    data: { label: 'test1' },
    position: { x: 200, y: 0 }
  })
  nodes.push({
    id: '2',
    data: { label: 'test2' },
    position: { x: 100, y: 100 }
  })
  edges.push({ id: '1-2', source: '1', target: '2' })

  return flow
}

// SQLを入力するフォーム
type SQLFormProps = {
  onClick: (flow: FlowState) => void
}
const SQLForm = (props: SQLFormProps) => {
  const [query, setQuery] = useState<Query>('select *\nfrom table1')

  return (
    <form style={{ border: '1px solid black', marginBlockEnd: '0em', background: 'lightgray' }}>
      <label>
        SQL: <br />
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ width: '100%' }}
          rows={30}
        />
      </label>
      <input
        type='button'
        value='create graph'
        onClick={() => props.onClick(createGraphFromQuery(query))}
      />
    </form>
  )
}

// グラフ
type GraphProps = FlowState
const Graph = (props: GraphProps) => {
  return (
    <ReactFlow style={{ border: '1px solid black' }} nodes={props.nodes} edges={props.edges}>
      <Controls />
      <Background />
    </ReactFlow>
  )
}

// 全体
const App = () => {
  const [flow, setFlow] = useState<FlowState>({
    nodes: [],
    edges: []
  })

  return (
    <Split sizes={[30, 70]} style={{ display: 'flex', height: '500px' }}>
      <SQLForm onClick={setFlow} />
      <Graph nodes={flow.nodes} edges={flow.edges} />
    </Split>
  )
}

const container = document.getElementById('app')!
const root = createRoot(container)
root.render(<App />)
