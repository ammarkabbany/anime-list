// search route

import { NextResponse } from 'next/server'
import { env } from '@/env'
import { type AnimeResponse } from '@/types/jikan'

function removeDuplicates(results: AnimeResponse['data']) {
  const seen = new Set();
  return results.filter((item) => {
    const duplicate = seen.has(item.title);
    seen.add(item.title);
    return !duplicate;
  });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query')

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 })
  }

  try {
    const response = await fetch(`${env.NEXT_PUBLIC_JIKAN_API_URL}/anime?q=${query}&limit=4&sfw=false`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const data = (await response.json()) as AnimeResponse

    const results = removeDuplicates(data.data)

    return NextResponse.json({data: results, pagination: data.pagination})
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
  }
}