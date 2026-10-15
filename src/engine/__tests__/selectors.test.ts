import { describe, expect, it } from 'vitest'
import { createSelectors } from '@/engine/selectors'
import { atEvening, content, run, started, withAffection } from './fixtures'

const selectors = createSelectors(content)

describe('selectors', () => {
  it('names unknown speakers "You"', () => {
    expect(selectors.name('ivy')).toBe('Ivy')
    expect(selectors.name('nobody')).toBe('You')
  })

  it('deltaChips skips zeros and inverts rivals', () => {
    expect(selectors.deltaChips({ ivy: 0, mae: -2, rex: 1, sam: 3 })).toEqual([
      { id: 'mae', label: 'Mae', good: false, up: false },
      { id: 'rex', label: "REX's odds", good: false, up: true },
      { id: 'sam', label: 'SAM', good: true, up: true },
    ])
  })

  it('resolves dynamic scene lines at read time', () => {
    const scene = selectors.currentScene(started(1, 'neo'))
    expect(scene?.lines).toEqual([
      { speaker: null, text: 'It is day 0.' },
      { speaker: 'ivy', text: 'hi neo' },
    ])
    expect(scene?.choices).toEqual(['up', 'down', 'both', 'flag it'])
  })

  it('firstImpressions maps the sum to a mood', () => {
    expect(selectors.firstImpressions({ age: 18, height: 60, vibe: 'loud' }).entries).toEqual([
      { id: 'ivy', name: 'Ivy', value: 0, mood: 'neutral' },
      { id: 'mae', name: 'Mae', value: 3, mood: 'happy' },
      { id: 'zoe', name: 'Zoe', value: -1, mood: 'upset' },
    ])
  })

  it('playerAvatar uses the matched girl theme', () => {
    const s = started(1, 'neo')
    expect(selectors.playerAvatar(s)).toEqual({
      spec: { skin: '#s2', hair: '#h1', style: 'short', bg: '#D3D1C7', shirt: '#185FA5', acc: 'none', ears: null, earColor: '', earInner: '' },
      label: 'neo avatar',
    })
    expect(selectors.playerAvatar({ ...s, matched: 'mae' }).spec).toMatchObject({
      bg: '#bgmae',
      ears: 'cat',
      earColor: '#000001',
      earInner: '#000002',
    })
    expect(selectors.playerAvatar({ ...s, player: { ...s.player, name: '' } }).label).toBe('Your avatar')
  })

  it('feed lists days up to today and the selected day posts', () => {
    const s = run(atEvening(), { type: 'nextDay' }, { type: 'setView', view: 'feed' })
    const feed = selectors.feed(s)
    expect(feed.days.map((d) => d.label)).toEqual(['Mon', 'Tue'])
    expect(feed.isToday).toBe(true)
    expect(feed.posts.map((p) => p.id)).toEqual(['p1rex', 'p1zoe', 'p1mae', 'p1ivy'])
    expect(feed.posts[0]).toMatchObject({ name: 'REX', handle: '@rex' })
  })

  it('ending summarises the score, epilogues and rival endings', () => {
    const s = { ...withAffection(started(), { ivy: 9, mae: 9, zoe: 5, rex: 3, vic: 1, ace: 3 }), pick: 'ivy', phase: 'ending' as const }
    const ending = selectors.ending(s)!
    expect(ending.tier).toBe('good')
    expect(ending.mood).toBe('happy')
    expect(ending.label).toEqual({ label: 'Good', tone: 'success' })
    expect(ending.epilogues).toEqual([
      { id: 'mae', name: 'Mae', value: 9, mood: 'upset', text: 'Mae high' },
      { id: 'zoe', name: 'Zoe', value: 5, mood: 'neutral', text: 'Zoe mid' },
    ])
    expect(ending.rivals.map((r) => r.id)).toEqual(['ace'])
  })
})
