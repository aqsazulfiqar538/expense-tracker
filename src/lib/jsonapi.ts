// Helpers to flatten JSON:API payloads into plain objects.
//
// The Rails backend uses jsonapi-serializer, which wraps every resource as:
//   { data: { id: "1", type: "expense", attributes: { title: "...", ... } } }
//
// Components should never see that shape (see ARCHITECTURE.md §8). Every
// function in `lib/api/*.ts` calls one of the helpers below before returning.
//
// why `unknown` over `any`:
//   `any` opts out of type-checking entirely; `unknown` forces the caller
//   to narrow before use. Since we're casting at a trust boundary (network),
//   the narrowing is intentional and explicit.

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

// Flatten one resource: id + every attribute hoisted onto the top level.
export const unwrap = <T,>(payload: JsonApiSingle): T => {
  const { id, attributes } = payload.data
  return { id, ...attributes } as T
}

export const unwrapList = <T,>(payload: JsonApiList): T[] => {
  return payload.data.map((d) => ({ id: d.id, ...d.attributes }) as T)
}
