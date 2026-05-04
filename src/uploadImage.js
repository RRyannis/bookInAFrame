import { supabase } from './supabaseClient';

async function uploadImage(file, userId) {
    if (!file) return null;

    const fileName = `${userId}/${Date.now()}_${file.name}`;
    const filePath = `post_images/${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
        .from('bookInAFrameStorage')
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true         
        });

    if (uploadError) {
        console.error("Image upload failed:", uploadError);
        return null;
    }

    const { data: urlData } = supabase.storage
        .from('bookInAFrameStorage')
        .getPublicUrl(filePath);
    
    return urlData.publicUrl;
}