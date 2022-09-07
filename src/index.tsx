import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import Split from 'react-split'
import ReactFlow, { Background, Controls } from 'react-flow-renderer'

type Query = string

// SQLを入力するフォーム
const SQLForm = () => {
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
      <input type='button' value='create graph' />
    </form>
  )
}

// グラフ
const Graph = () => {
  return (
    <ReactFlow style={{ border: '1px solid black' }}>
      <Controls />
      <Background />
    </ReactFlow>
  )
}

// 全体
const App = () => {
  return (
    <Split sizes={[30, 70]} style={{ display: 'flex', height: '500px' }}>
      <SQLForm />
      <Graph />
    </Split>
  )
}

const container = document.getElementById('app')!
const root = createRoot(container)
root.render(<App />)
