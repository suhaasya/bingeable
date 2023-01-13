function capitalize(str: string): string {
  return str.toLowerCase().replace(/\b./g, function (a) {
    return a.toUpperCase()
  })
}

export default capitalize
