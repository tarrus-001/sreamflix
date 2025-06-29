
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { query, type = 'search', page = 1 } = await req.json()
    const apiKey = Deno.env.get('TMDB_API_KEY')

    if (!apiKey) {
      throw new Error('TMDB API key not configured')
    }

    const baseUrl = 'https://api.themoviedb.org/3'
    let url: string

    switch (type) {
      case 'search':
        if (!query) throw new Error('Query is required for search')
        url = `${baseUrl}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&page=${page}`
        break
      case 'popular':
        url = `${baseUrl}/movie/popular?api_key=${apiKey}&page=${page}`
        break
      case 'trending':
        url = `${baseUrl}/trending/movie/week?api_key=${apiKey}&page=${page}`
        break
      case 'top_rated':
        url = `${baseUrl}/movie/top_rated?api_key=${apiKey}&page=${page}`
        break
      default:
        throw new Error('Invalid request type')
    }

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`)
    }

    const data = await response.json()
    
    // Transform the data to match our Movie interface
    const transformedResults = data.results.map((movie: any) => ({
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      poster_path: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder.svg',
      backdrop_path: movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : '/placeholder.svg',
      release_date: movie.release_date,
      vote_average: movie.vote_average,
      genre_ids: movie.genre_ids,
      adult: movie.adult,
      original_language: movie.original_language,
      popularity: movie.popularity,
      video: movie.video,
      vote_count: movie.vote_count,
    }))

    const transformedData = {
      ...data,
      results: transformedResults
    }

    return new Response(
      JSON.stringify(transformedData),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})
