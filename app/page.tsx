import { supabase } from '@/lib/supabase';
import HomeClient from '@/components/home/home-client';

async function getTours() {
  const { data } = await supabase
    .from('tour_packages')
    .select('*')
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(9);
  return data || [];
}

async function getHajjPackages() {
  const { data } = await supabase
    .from('hajj_umrah_packages')
    .select('*')
    .eq('is_active', true)
    .order('base_price_bdt', { ascending: true });
  return data || [];
}

export const revalidate = 60;

export default async function Home() {
  const [tours, hajjPackages] = await Promise.all([getTours(), getHajjPackages()]);

  return <HomeClient tours={tours} hajjPackages={hajjPackages} />;
}
