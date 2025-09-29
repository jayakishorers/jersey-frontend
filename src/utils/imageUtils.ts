// Ultra-compressed thumbnail generator
export const getThumbnail = (imagePath: string): string => {
  // Convert to ultra-low quality for 4KB size
  const fileName = imagePath.split('/').pop()?.split('.')[0];
  return `/thumbs/${fileName}_thumb.jpg`;
};

// Fallback placeholder as base64 (1KB)
export const getPlaceholder = (): string => {
  return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI0MCIgdmlld0JveD0iMCAwIDIwMCAyNDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjQwIiBmaWxsPSIjMzc0MTUxIi8+CjxwYXRoIGQ9Ik0xMDAgMTIwQzEwNSAxMjAgMTEwIDEyNSAxMTAgMTMwVjE2MEMxMTAgMTY1IDEwNSAxNzAgMTAwIDE3MEg5MEM4NSAxNzAgODAgMTY1IDgwIDE2MFYxMzBDODAgMTI1IDg1IDEyMCA5MCAxMjBIMTAwWiIgZmlsbD0iIzZCNzI4MCIvPgo8L3N2Zz4K';
};