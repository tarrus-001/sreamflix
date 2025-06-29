
-- Enable RLS (Row Level Security)
alter table if exists public.profiles enable row level security;
alter table if exists public.watchlist enable row level security;

-- Create profiles table for user data
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create watchlist table for saving movies/shows
create table if not exists public.watchlist (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  movie_id integer not null,
  movie_title text not null,
  movie_poster text,
  added_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);

create policy "Users can view own watchlist" on watchlist for select using (auth.uid() = user_id);
create policy "Users can insert to own watchlist" on watchlist for insert with check (auth.uid() = user_id);
create policy "Users can delete from own watchlist" on watchlist for delete using (auth.uid() = user_id);

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
