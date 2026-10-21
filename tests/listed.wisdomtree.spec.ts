import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

import { ANCHORS } from '@/constants/anchors';
import { fixtureMismatches, getListedAnchorByDomain } from '@/lib/stellar/listed-anchors';

const DOMAINS = ['stellar.wisdomtree.com'];

describe('listed anchor: WisdomTree', () => {
  it('resolves the entry by domain', () => {
    const entry = getListedAnchorByDomain('stellar.wisdomtree.com');
    expect(entry).toBeDefined();
    expect(entry?.id).toBe('wisdomtree');
    expect(entry?.kind).toBe('issuer');
  });

  it('returns the same entry for every domain', () => {
    const entry = getListedAnchorByDomain('stellar.wisdomtree.com');
    for (const domain of DOMAINS) {
      expect(getListedAnchorByDomain(domain)).toBe(entry);
    }
  });

  it('lists all 18 assets', () => {
    const entry = getListedAnchorByDomain('stellar.wisdomtree.com');
    expect(entry?.assets).toHaveLength(18);
    expect(entry?.assets).toContainEqual(
      expect.objectContaining({
        code: 'USD',
        issuer: 'GC2ATEL4K2O5BJO7Z76MYSV6TKHCROKV5GXEOU7NO2TUEOOMFDDIPWID',
      })
    );
  });

  it('matches the fixture', () => {
    const entry = getListedAnchorByDomain('stellar.wisdomtree.com');
    const toml = readFileSync('tests/fixtures/listed/wisdomtree.toml', 'utf8');
    expect(entry && fixtureMismatches(entry, toml)).toEqual([]);
  });

  it('is not a routable anchor', () => {
    const domains = getListedAnchorByDomain('stellar.wisdomtree.com')?.domains ?? [];
    for (const anchor of ANCHORS) {
      expect(domains).not.toContain(anchor.homeDomain);
      if (anchor.serviceDomain) expect(domains).not.toContain(anchor.serviceDomain);
    }
  });
});
