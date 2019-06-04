export const parseGraph = csv => {
  let rows = csv.split('\r\n')
  let headers = rows.shift().split(',')
  let graph = rows.map(str => {
    const row = str.split(',')
    return {
      [headers[0]]: row[0],
      [headers[1]]: row[1]
    }
  })
  return graph
}

export const findSubTree = (graph, type) => {
  let result = []
  for (let i = 0; i < graph.length; i++) {
    const element = graph[i]
    if (element.subject === type) {
      // get its parent
      if (element.supertype !== '') {
        let parent = graph.filter(d => d.subject === element.supertype)[0]
        result.push({ supertype: null, subject: parent.subject })
      }
      // now put the element
      result.push(element)
    }
    // for children
    if (element.supertype === type) result.push(element)
  }
  return result
}
