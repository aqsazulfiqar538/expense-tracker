
export type User = {
  id: string
  email: string
  first_name: string
  last_name: string
  phone_number: string
  date_of_birth: string
}

export type PublicUser = {
  id: string
  first_name: string
  last_name: string
}

export type UserSummary = {
  id: number
  first_name: string
  last_name: string
  full_name: string
  initials: string
}
