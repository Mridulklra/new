'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AddBookmarkForm from '@/components/AddBookmarkForm'
import BookmarkList from '@/components/BookmarkList'
import type { Bookmark } from '@/lib/types'

export default function BookmarksPage() {
  const router = useRouter()
  const supabase = createClient()
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [userId, setUserId] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initPage = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }

      setUserId(user.id)

      // Fetch initial bookmarks
      const response = await fetch('/api/bookmarks')
      if (response.ok) {
        const data = await response.json()
        setBookmarks(data)
      }
      
      setLoading(false)
    }

    initPage()
  }, [router, supabase])

  const handleAddBookmark = async (url: string, title: string) => {
    const response = await fetch('/api/bookmarks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url, title }),
    })

    if (!response.ok) {
      throw new Error('Failed to add bookmark')
    }

    // Real-time subscription will handle UI update
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading bookmarks...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">My Bookmarks</h1>
          <p className="text-gray-600 mt-2">
            Your personal bookmark collection with real-time sync
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Bookmark Form - Left Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <AddBookmarkForm onAdd={handleAddBookmark} />
              
              {/* Real-time Indicator */}
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-700 font-medium">
                    Real-time sync active
                  </span>
                </div>
                <p className="text-xs text-green-600 mt-2">
                  Changes sync automatically across all your devices
                </p>
              </div>
            </div>
          </div>

          {/* Bookmark List - Main Content */}
          <div className="lg:col-span-2">
            <BookmarkList initialBookmarks={bookmarks} userId={userId} />
          </div>
        </div>
      </div>
    </div>
  )
}
