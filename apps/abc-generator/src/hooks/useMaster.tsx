function name(params: type) {
  const { theme } = useZustend()
  const { data: todos } = useReactQuery()
  const { refreshTodos } = useReactQueryMotation()
  return {
    theme,
    todos,
    refreshTodos,
  }
}

// como adicionar uma todo mas não necessariamente mandar pro db nuvem
// o app ter db local (zustend) / db nuvem
