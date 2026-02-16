export interface Bookmark {
  id: string
  userId: string
  url: string
  title: string
  createdAt: Date
  updatedAt: Date
}

export interface User {
  id: string
  email?: string
  user_metadata?: {
    name?: string
    avatar_url?: string
  }
}
