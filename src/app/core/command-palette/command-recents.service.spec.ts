import { TestBed } from '@angular/core/testing';
import { CommandRecentsService } from './command-recents.service';

describe('CommandRecentsService', () => {
  let service: CommandRecentsService;

  beforeEach(() => {
    localStorage.clear();
    service = TestBed.inject(CommandRecentsService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('starts empty', () => {
    expect(service.list()).toEqual([]);
  });

  it('records a route with newest first and no duplicates', () => {
    service.record('Pricing section', '/showcase/new-design-ideas/pricing-section');
    service.record('ERP dashboard', '/showcase/new-design-ideas/erp-dashboard');
    service.record('Pricing section', '/showcase/new-design-ideas/pricing-section');

    const list = service.list();
    expect(list).toHaveLength(2);
    expect(list[0].label).toBe('Pricing section');
    expect(list[1].label).toBe('ERP dashboard');
  });

  it('caps at MAX (5) entries', () => {
    for (let i = 0; i < 8; i++) {
      service.record(`Item ${i}`, `/app/item-${i}`);
    }
    expect(service.list()).toHaveLength(5);
    expect(service.list()[0].label).toBe('Item 7');
  });

  it('persists to localStorage', () => {
    service.record('Button', '/showcase/atoms/button');
    const stored = JSON.parse(localStorage.getItem('rdk_command_recents_v1') ?? '[]') as { label: string }[];
    expect(stored[0].label).toBe('Button');
  });

  it('ignores undefined, malformed storage', () => {
    localStorage.setItem('rdk_command_recents_v1', 'not-json');
    const reloaded = TestBed.inject(CommandRecentsService);
    expect(reloaded.list()).toEqual([]);
  });

  it('rejects malformed entries on load', () => {
    localStorage.setItem('rdk_command_recents_v1', JSON.stringify([{ label: 'X' }, 42, null]));
    const reloaded = TestBed.inject(CommandRecentsService);
    expect(reloaded.list()).toEqual([]);
  });

  it('clears the list and storage', () => {
    service.record('Button', '/showcase/atoms/button');
    service.clear();
    expect(service.list()).toEqual([]);
    expect(localStorage.getItem('rdk_command_recents_v1')).toBe('[]');
  });
});