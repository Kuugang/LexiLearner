export function useGetCoverFromGDrive(url: string): string | undefined {
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)|id=([a-zA-Z0-9_-]+)/);
  const fileId = match ? match[1] || match[2] : null;
  return fileId
    ? `https://drive.google.com/uc?export=view&id=${fileId}`
    : undefined;
}
