
type JsonApiResource = {
  id: string
  type: string
  attributes: Record<string, unknown>
  relationships?: Record<string, unknown>
}

type JsonApiSingle = { data: JsonApiResource; included?: JsonApiResource[] }
type JsonApiList = {
  data: JsonApiResource[]
  included?: JsonApiResource[]
  meta?: unknown
}

export const unwrap = <T,>(payload: JsonApiSingle): T => {
  const { id, attributes } = payload.data
  return { id, ...attributes } as T
}

export const unwrapList = <T,>(payload: JsonApiList): T[] => {
  return payload.data.map((d) => ({ id: d.id, ...d.attributes }) as T)
}
