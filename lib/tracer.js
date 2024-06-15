const opentelemetry = require('@opentelemetry/api')

const tracer = opentelemetry.trace.getTracer('node-mssql', '10.0.2')

function getSpanName (query) {
  if (typeof query === 'string') {
    return query.split(' ')[0]
  }

  if (Array.isArray(query)) {
    return query[0].split(' ')[0]
  }

  return ''
}

function getCollectionName (query) {
  if (typeof query !== 'string') {
    return ''
  }

  // Get the word after the FROM or INTO or DELETE or UPDATE keyword
  const fromIndex = query.toLowerCase().indexOf('from')
  const intoIndex = query.toLowerCase().indexOf('into')
  const deleteIndex = query.toLowerCase().indexOf('delete')
  const updateIndex = query.toLowerCase().indexOf('update')

  const from = fromIndex > -1 ? query.substring(fromIndex + 5) : ''
  const into = intoIndex > -1 ? query.substring(intoIndex + 5) : ''
  const deleteWord = deleteIndex > -1 ? query.substring(deleteIndex + 7) : ''
  const updateWord = updateIndex > -1 ? query.substring(updateIndex + 7) : ''

  const collection = from || into || deleteWord || updateWord
  return collection.split(' ')[0]
}

module.exports = {
  tracer,
  getSpanName,
  getCollectionName
}
