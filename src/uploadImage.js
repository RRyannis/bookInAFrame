import { supabase } from './supabaseClient';

// Handles uploading the file to Supabase Storage
async function uploadImage(file, userId) {
    if (!file) return null;

    // Create a unique file path: e.g., 'posts/user_123/image_timestamp.jpg'
    const fileName = `${userId}/${Date.now()}_${file.name}`;
    const filePath = `post_images/${fileName}`;

    // 1. Upload the file to the 'post_images' bucket
    const { data: uploadData, error: uploadError } = await supabase.storage
        .from('post_images')
        .upload(filePath, file, {
            cacheControl: '3600', // How long the browser should cache the image
            upsert: true         // Overwrite if a file with the same name exists
        });

    if (uploadError) {
        console.error("Image upload failed:", uploadError);
        return null;
    }

    // 2. Get the public URL for the uploaded image
    // Note: If your bucket is Private, you must use createSignedUrl instead
    const { data: urlData } = supabase.storage
        .from('post_images')
        .getPublicUrl(filePath);
    
    return urlData.publicUrl; // This is the string we save to the database!
}