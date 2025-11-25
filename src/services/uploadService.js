export const uploadBase64ToCloudinary = async (
  dataUrl,
  cloudName,
  uploadPreset
) => {
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  const formData = new FormData();
  // Cloudinary accepts data URLs in the `file` field
  formData.append("file", dataUrl);
  formData.append("upload_preset", uploadPreset);

  const res = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Cloudinary upload failed: ${res.status} ${text}`);
  }

  const json = await res.json();
  return json.secure_url || json.url;
};
