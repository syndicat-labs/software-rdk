import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { APP_CONFIG } from '../config/app-config.token';
import { DEFAULT_AUTH_CONFIG } from '../config/app-config.model';
import { NAV_ITEMS } from '../../layout/nav-items.token';
import { CommandPaletteComponent } from './command-palette.component';
import { CommandPaletteService } from './command-palette.service';

const TEST_CONFIG = {
  environment: { production: false, apiBaseUrl: '', authBaseUrl: '', logLevel: 'error' as const },
  api: { baseUrl: 'http://localhost:3000/api', timeoutMs: 1000, maxRetries: 0 },
  auth: DEFAULT_AUTH_CONFIG,
  features: {},
};

describe('CommandPaletteComponent', () => {
  let fixture: ComponentFixture<CommandPaletteComponent>;
  let service: CommandPaletteService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [CommandPaletteComponent],
      providers: [
        { provide: APP_CONFIG, useValue: TEST_CONFIG },
        {
          provide: NAV_ITEMS,
          useValue: [
            { label: 'Home', icon: 'pi pi-home', routerLink: '/app/dashboard' },
            { label: 'Profile', icon: 'pi pi-user', routerLink: '/app/profile' },
          ],
          multi: true,
        },
        provideRouter([]),
      ],
    });
    fixture = TestBed.createComponent(CommandPaletteComponent);
    fixture.detectChanges();
    service = TestBed.inject(CommandPaletteService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('renders nothing when closed', () => {
    expect(fixture.nativeElement.querySelector('.palette')).toBeNull();
  });

  it('renders the dialog when opened and focuses the input', fakeAsync(() => {
    service.open();
    fixture.detectChanges();
    tick();
    const dialog = fixture.nativeElement.querySelector('.palette__dialog');
    expect(dialog).not.toBeNull();
    expect(document.activeElement?.classList.contains('palette__input')).toBe(true);
  }));

  it('lists navigation entries grouped under "Go to"', () => {
    service.open();
    fixture.detectChanges();
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Go to');
    expect(text).toContain('Home');
    expect(text).toContain('Profile');
  });

  it('filters entries by query', () => {
    service.open();
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('.palette__input') as HTMLInputElement;
    input.value = 'Home';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Home');
    expect(text).not.toContain('Profile');
  });

  it('shows the empty state for an unmatched query', () => {
    service.open();
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('.palette__input') as HTMLInputElement;
    input.value = 'zzzz-nothing';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('No results');
  });

  it('closes on Escape', () => {
    service.open();
    fixture.detectChanges();
    const dialog = fixture.nativeElement.querySelector('.palette__dialog') as HTMLElement;
    dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();
    expect(service.visible()).toBe(false);
  });

  it('moves the active item with ArrowDown and selects it with Enter', () => {
    service.open();
    fixture.detectChanges();
    const dialog = fixture.nativeElement.querySelector('.palette__dialog') as HTMLElement;
    dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    fixture.detectChanges();

    const active = fixture.nativeElement.querySelectorAll('.palette__item--active');
    expect(active).toHaveLength(1);
    expect(fixture.nativeElement.querySelectorAll('.palette__item')[1].classList.contains('palette__item--active')).toBe(true);

    dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    fixture.detectChanges();
    expect(service.visible()).toBe(false);
  });
});