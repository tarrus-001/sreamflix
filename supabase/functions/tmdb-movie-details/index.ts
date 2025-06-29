
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { movieId } = await req.json()
    const apiKey = Deno.env.get('TMDB_API_KEY')

    if (!apiKey) {
      throw new Error('TMDB API key not configured')
    }

    if (!movieId) {
      throw new Error('Movie ID is required')
    }

    const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`)
    }

    const data = await response.json()
    
    // Transform the data to match our Movie interface
    const transformedData = {
      id: data.id,
      title: data.title,
      overview: data.overview,
      poster_path: data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : '/placeholder.svg',
      backdrop_path: data.backdrop_path ? `https://image.tmdb.org/t/p/original${data.backdrop_path}` : '/placeholder.svg',
      release_date: data.release_date,
      vote_average: data.vote_average,
      genre_ids: data.genres?.map((g: any) => g.id) || [],
      adult: data.adult,
      original_language: data.original_language,
      popularity: data.popularity,
      video: data.video,
      vote_count: data.vote_count,
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
