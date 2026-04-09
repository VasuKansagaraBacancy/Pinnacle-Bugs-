import { supabase } from '@/lib/supabase';
import { Bug, CreateBugPayload, UpdateBugPayload } from '@/lib/types';

const TABLE = 'bugs';
const BUCKET = 'bug-images';

// ── Image Upload ─────────────────────────────────────────────
export async function uploadBugImage(file: File): Promise<string> {
  const ext = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(fileName, file, {
    cacheControl: '3600',
    upsert: false,
  });

  if (error) throw new Error(`Image upload failed: ${error.message}`);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
  return data.publicUrl;
}

export async function uploadBugImages(files: File[]): Promise<string[]> {
  return Promise.all(files.map(uploadBugImage));
}

export async function deleteBugImage(imageUrl: string): Promise<void> {
  const parts = imageUrl.split(`/${BUCKET}/`);
  if (parts.length < 2) return;
  const filePath = parts[1];
  const { error } = await supabase.storage.from(BUCKET).remove([filePath]);
  if (error) console.error('Failed to delete image:', error.message);
}

export async function deleteBugImages(imageUrls: string[]): Promise<void> {
  await Promise.all(imageUrls.map(deleteBugImage));
}

// ── CRUD ─────────────────────────────────────────────────────
export async function fetchBugs(): Promise<Bug[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('date', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data as Bug[];
}

export async function fetchBugById(id: string): Promise<Bug> {
  const { data, error } = await supabase.from(TABLE).select('*').eq('id', id).single();

  if (error) throw new Error(error.message);
  return data as Bug;
}

export async function createBug(payload: CreateBugPayload): Promise<Bug> {
  const { data, error } = await supabase.from(TABLE).insert([payload]).select().single();

  if (error) throw new Error(error.message);
  return data as Bug;
}

export async function updateBug(id: string, payload: UpdateBugPayload): Promise<Bug> {
  const { data, error } = await supabase
    .from(TABLE)
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Bug;
}

export async function deleteBug(id: string): Promise<void> {
  const bug = await fetchBugById(id);

  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) throw new Error(error.message);

  if (bug.image_urls?.length) {
    await deleteBugImages(bug.image_urls);
  }
}
