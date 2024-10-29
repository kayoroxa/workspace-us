function sortByOccurrence(objArray, keyQuery) {
  const allKeys = [...new Set(objArray.map(v => v[keyQuery]))]

  const allKeysWithCount = allKeys.map(key => {
    return {
      [keyQuery]: key,
      count: objArray.filter(v => v[keyQuery] === key).length,
    }
  })

  const result = allKeysWithCount.sort((a, b) => b.count - a.count)

  return result
}

module.exports = {
  sortByOccurrence,
}
