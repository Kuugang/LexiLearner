export function useExtractDriveFileId(url: string): string | null {
  // Matches both /file/d/FILEID/ and id=FILEID
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)|id=([a-zA-Z0-9_-]+)/);
  return match ? match[1] || match[2] : null;
}
