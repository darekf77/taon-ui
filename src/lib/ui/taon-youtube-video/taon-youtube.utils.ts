export namespace TaonYouTubeUtils {
  export async function getVidesIdsOfPlaylist(
    ytplaylistId: string,
  ): Promise<string[]> {
    const url = `https://www.youtube.com/playlist?list=${encodeURIComponent(ytplaylistId)}`;

    const response = await fetch(url, {
      headers: {
        'accept-language': 'en-US,en;q=0.9',
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch playlist page: ${response.status} ${response.statusText}`,
      );
    }

    const html = await response.text();

    const matches = [...html.matchAll(/"videoId":"([a-zA-Z0-9_-]{11})"/g)];
    const ids = matches.map(match => match[1]);

    return [...new Set(ids)];
  }

  export function extractPlaylistId(input: string): string {
    if (!input.includes('http')) {
      return input.split('&')[0].trim();
    }

    const url = new URL(input);
    return (url.searchParams.get('list') || '').trim();
  }
}
