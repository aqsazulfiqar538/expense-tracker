// Flat User shape — what components see after `lib/api/users.ts` unwraps the
// JSON:API response. Field names match the Rails serializer exactly so the
// unwrap step is a no-op cast.

export type User = {
  id: string
  email: string
  first_name: string
  last_name: string
  phone_number: string
  date_of_birth: string
}

// Light shape used in places like search results and friend lists, where
// PII like email/phone shouldn't be exposed. Backend returns this shape via
// PublicUserSerializer.
export type PublicUser = {
  id: string
  first_name: string
  last_name: string
}
