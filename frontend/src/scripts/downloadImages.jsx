import JSZip from "jszip";

/**
 * Baixa uma ou várias imagens base64 como ZIP (ou como imagem única se só houver uma).
 * @param {Array} images - Array de objetos no formato { buffer: base64String, filename: "nome.jpg" }
 */
export async function downloadAllImages(images = []) {
  if (!images || images.length === 0) {
    console.warn("Nenhuma imagem para baixar.");
    return;
  }

  // Apenas uma imagem? Baixa direto.
  if (images.length === 1) {
    const { buffer, filename } = images[0];
    downloadBase64Image(buffer, filename);
    return;
  }

  const zip = new JSZip();

  for (const img of images) {
    const byteCharacters = atob(img.buffer);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const fileExtension = img.filename.split(".").pop().toLowerCase();
    const mimeType =
      fileExtension === "webp" ? "image/webp" : "image/jpeg";

    const blob = new Blob([byteArray], { type: mimeType });

    zip.file(img.filename, blob);
  }

  const zipBlob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(zipBlob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "compresso_images_compressed.zip";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}


export function downloadBase64Image(base64, filename) {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);

  const extension = filename.split('.').pop().toLowerCase();
  const mimeType = extension === 'webp' ? 'image/webp' : 'image/jpeg';

  const blob = new Blob([byteArray], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = "compresso_single_"+filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
