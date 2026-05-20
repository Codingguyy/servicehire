async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token=localStorage.getItem('token')

  const headers:Record<string,string>={
    'Content-Type':'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> ?? {}),
  }

  const res=await fetch(`/api${endpoint}`,{...options, headers})

  if (res.status===401&&!endpoint.includes('/auth/')) {
    localStorage.removeItem('token')
    window.location.href = '/login'
  }

  const data = await res.json()
  return data as T
}

export const http={
  get: <T>(url: string)=>request<T>(url),
  post: <T>(url: string,body:unknown)=>request<T>(url, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(url: string, body: unknown) => request<T>(url, { method: 'PUT', body: JSON.stringify(body) }),
  delete: <T>(url: string) => request<T>(url, { method: 'DELETE' }),
  getBlob: async (url: string) => {
    const token = localStorage.getItem('token')
    const res = await fetch(`/api${url}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    return res.blob()
  },
}

export default http
