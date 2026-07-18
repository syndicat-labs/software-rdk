import { render, screen, fireEvent } from '@testing-library/angular';
import { AvatarComponent } from './avatar/avatar.component';
import { ChipComponent } from './chip/chip.component';

describe('AvatarComponent', () => {
  it('renders an image when src is provided', async () => {
    await render(AvatarComponent, { componentProperties: { src: 'x.png', name: 'Jane Doe' } });
    expect(document.querySelector('.rdk-avatar__img')).toBeInTheDocument();
  });

  it('falls back to initials when the image errors', async () => {
    const { fixture } = await render(AvatarComponent, {
      componentProperties: { src: 'x.png', name: 'Jane Doe' },
    });
    fireEvent.error(document.querySelector('.rdk-avatar__img') as HTMLImageElement);
    fixture.detectChanges();
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('renders initials from the name when no src', async () => {
    await render(AvatarComponent, { componentProperties: { name: 'Ada Lovelace' } });
    expect(screen.getByText('AL')).toBeInTheDocument();
  });

  it('renders the fallback icon with neither src nor name', async () => {
    await render(AvatarComponent, {});
    expect(document.querySelector('.rdk-avatar__icon')).toBeInTheDocument();
  });

  it('renders the fallback icon for a whitespace-only name', async () => {
    await render(AvatarComponent, { componentProperties: { name: '   ' } });
    expect(document.querySelector('.rdk-avatar__icon')).toBeInTheDocument();
  });

  it('computes empty initials while a valid image src is present', async () => {
    const { fixture } = await render(AvatarComponent, {
      componentProperties: { src: 'x.png', name: 'Jane Doe' },
    });
    const instance = fixture.componentInstance as unknown as { initials(): string };
    expect(instance.initials()).toBe('');
  });

  it('resets the image-error state when inputs change', async () => {
    const { fixture, rerender } = await render(AvatarComponent, {
      componentProperties: { src: 'a.png', name: 'Jane Doe' },
    });
    fireEvent.error(document.querySelector('.rdk-avatar__img') as HTMLImageElement);
    fixture.detectChanges();
    expect(screen.getByText('JD')).toBeInTheDocument();

    await rerender({ componentProperties: { src: 'b.png', name: 'Jane Doe' } });
    expect(document.querySelector('.rdk-avatar__img')).toBeInTheDocument();
  });
});

describe('ChipComponent', () => {
  interface ChipInternals {
    onSelect(): void;
    onSelectSpace(event: KeyboardEvent): void;
    onDismiss(event: MouseEvent): void;
  }

  function chip(overrides: Partial<ChipComponent> = {}): ChipComponent & ChipInternals {
    const instance = new ChipComponent();
    Object.assign(instance, overrides);
    return instance as ChipComponent & ChipInternals;
  }

  it('emits selectedChange when selectable and enabled', () => {
    const c = chip({ selectable: true, selected: false });
    const values: boolean[] = [];
    c.selectedChange.subscribe((v) => values.push(v));
    c.onSelect();
    expect(values).toEqual([true]);
  });

  it('does not emit when not selectable', () => {
    const c = chip({ selectable: false });
    const values: boolean[] = [];
    c.selectedChange.subscribe((v) => values.push(v));
    c.onSelect();
    expect(values).toEqual([]);
  });

  it('does not emit when disabled', () => {
    const c = chip({ selectable: true, disabled: true });
    const values: boolean[] = [];
    c.selectedChange.subscribe((v) => values.push(v));
    c.onSelect();
    expect(values).toEqual([]);
  });

  it('space key selects and prevents default scrolling', () => {
    const c = chip({ selectable: true });
    const values: boolean[] = [];
    c.selectedChange.subscribe((v) => values.push(v));
    const event = new KeyboardEvent('keydown', { key: ' ' });
    const prevent = jest.spyOn(event, 'preventDefault');
    c.onSelectSpace(event);
    expect(prevent).toHaveBeenCalled();
    expect(values).toEqual([true]);
  });

  it('dismiss emits and stops propagation when enabled', () => {
    const c = chip({ dismissible: true });
    const dismissed = jest.fn();
    c.dismissed.subscribe(dismissed);
    const event = new MouseEvent('click');
    const stop = jest.spyOn(event, 'stopPropagation');
    c.onDismiss(event);
    expect(stop).toHaveBeenCalled();
    expect(dismissed).toHaveBeenCalled();
  });

  it('dismiss does not emit when disabled', () => {
    const c = chip({ disabled: true });
    const dismissed = jest.fn();
    c.dismissed.subscribe(dismissed);
    c.onDismiss(new MouseEvent('click'));
    expect(dismissed).not.toHaveBeenCalled();
  });
});
