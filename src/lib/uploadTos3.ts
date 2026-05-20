export const uploadToS3 = async (
  file: File,
  folder: "recipes" | "reels"
) => {
  try {
    // Get signed URL
    const response = await fetch("/api/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fileType: file.type,
        fileName: `${folder}-${Date.now()}-${file.name}`,
        folder,
      }),
    });

    const data = await response.json();

    // Upload directly to AWS
    await fetch(data.signedUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });

    return data.fileUrl;
  } catch (error) {
    console.error(error);
    throw error;
  }
};