import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import Split from 'react-split'
import ReactFlow, { Node, Edge, Background, Controls } from 'react-flow-renderer'
import { Parser, AST } from 'node-sql-parser'

type Query = string

type FlowState = {
  nodes: Node[]
  edges: Edge[]
}

const createGraphFromQuery = (query: Query) => {
  const position = { x: 0, y: 0 }
  const nodes: Node[] = []
  const edges: Edge[] = []
  const flow: FlowState = { nodes, edges }

  // クエリ文をパースする
  const parser = new Parser()
  const ast = parser.astify(query, { database: 'BigQuery' }) as AST
  const tableList = parser.tableList(query, { database: 'BigQuery' })

  console.log(tableList)

  // 得られたテーブルリストをグラフのノードに追加する
  tableList.forEach((table_elem) => {
    const table_name = table_elem.split(/::/)[2]
    nodes.push({
      id: table_name,
      data: { label: table_name },
      position
    })
  })

  // 単なるDictまで型を緩める（扱いに慣れてないため）
  type Dict<T = any> = Record<string, T>
  const astDict = ast as Dict
  console.log(astDict)

  // with句にあるfrom情報をグラフのエッジに追加する
  astDict.with?.forEach((with_elem: Dict) => {
    if (with_elem.stmt.ast.type !== 'select') {
      return
    }
    with_elem.stmt.ast.from?.forEach((from_elem: Dict) => {
      edges.push({
        id: from_elem.table + '-' + with_elem.name.value,
        source: from_elem.table,
        target: with_elem.name.value,
        type: 'smoothstep'
      })
    })
  })

  // 最終的なselect句をグラフのノードに追加する
  nodes.push({
    id: '(select)',
    data: { label: '(select)' },
    type: 'output',
    style: {
      color: 'navy'
    },
    position
  })

  // 最終的なselect句にあるfrom情報をグラフのエッジに追加する
  astDict.select.from?.forEach((from_elem: Dict) => {
    edges.push({
      id: from_elem.table + '-(select)',
      source: from_elem.table,
      target: '(select)',
      type: 'smoothstep'
    })
  })

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
