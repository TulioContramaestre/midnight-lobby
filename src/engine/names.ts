import type { CharacterId, ContentRegistry } from '@/content/types'

export function characterName(content: ContentRegistry, id: CharacterId): string {
  return content.character(id)?.name ?? 'You'
}
