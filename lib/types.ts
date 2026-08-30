export type ViewerProfile = {
  id: string
  username: string
  display_name: string | null
  avatar_url: string | null
  role: 'member' | 'trusted_researcher' | 'moderator' | 'admin'
  reputation: number
}

export type Category = {
  id: string
  label: string
  description: string | null
  sort_order: number
}

export type Indicator = {
  id: string
  indicator_type: string
  value: string
  normalized_value: string
}

export type FeedCase = {
  id: string
  author_id: string
  title: string
  summary: string | null
  body: string
  category: string
  categoryLabel: string
  status: string
  visibility: string
  is_locked: boolean
  created_at: string
  updated_at: string
  author: ViewerProfile | null
  score: number
  commentCount: number
  evidenceCount: number
  evidencePreviewUrl?: string | null
  indicators: Indicator[]
  userVote: -1 | 0 | 1
  saved: boolean
}

export type CommentData = {
  id: string
  case_id: string
  author_id: string
  parent_id: string | null
  body: string
  visibility: string
  created_at: string
  updated_at: string
  author: ViewerProfile | null
  score: number
  userVote: -1 | 0 | 1
}

export type CaseDetailData = FeedCase & {
  evidence: Array<{
    id: string
    caption: string | null
    mime_type: string
    size_bytes: number
    sha256: string | null
    signedUrl: string | null
  }>
  comments: CommentData[]
}
