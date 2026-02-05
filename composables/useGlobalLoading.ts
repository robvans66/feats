import { ref } from 'vue'

const loading = ref(false)

export function useGlobalLoading() {
  function setLoading(v: boolean) { loading.value = v }
  async function wrap<T>(fn: () => Promise<T>) {
    setLoading(true)
    try { return await fn() }
    finally { setLoading(false) }
  }
  return { loading, setLoading, wrap }
}
