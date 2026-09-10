import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { APP_CONFIG } from '../../../core/config/app-config.token';
import { DEFAULT_AUTH_CONFIG } from '../../../core/config/app-config.model';
import { BentoHomeComponent } from './bento-home.component';
import { CommandPaletteService } from '../../../core/command-palette/command-palette.service';
import { CommandRecentsService } from '../../../core/command-palette/command-recents.service';
import { NAV_ITEMS } from '../../../layout/nav-items.token';

const TEST_CONFIG = {
  environment: { production: false, apiBaseUrl: '', authBaseUrl: '', logLevel: 'error' as const },
  api: { baseUrl: 'http://localhost:3000/api', timeoutMs: 1000, maxRetries: 0 },
  auth: DEFAULT_AUTH_CONFIG,
  features: {},
};

describe('BentoHomeComponent', () => {
  let fixture: ComponentFixture<BentoHomeComponent>;
  let recents: CommandRecentsService;
  let palette: CommandPaletteService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [BentoHomeComponent],
      providers: [
        { provide: APP_CONFIG, useValue: TEST_CONFIG },
        { provide: NAV_ITEMS, useValue: [], multi: true },
        provideRouter([]),
      ],
    });
    fixture = TestBed.createComponent(BentoHomeComponent);
    recents = TestBed.inject(CommandRecentsService);
    palette = TestBed.inject(CommandPaletteService);
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('renders the hero cell with product framing', () => {
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Build a product, not a gallery.');
    expect(text).toContain('languages');
  });

  it('shows the first-run empty state when there are no recents', () => {
    expect(fixture.nativeElement.textContent).toContain('Nothing open yet.');
    expect(fixture.nativeElement.querySelector('[data-testid="bento-recents"]')?.textContent).toContain('Browse the library');
  });

  it('surfaces recents as "Continue where you left off"', () => {
    recents.record('Button', '/showcase/atoms/button');
    fixture.detectChanges();
    const cell = fixture.nativeElement.querySelector('[data-testid="bento-recents"]') as HTMLElement;
    expect(cell.textContent).toContain('Button');
    expect(cell.querySelector('a[href="/showcase/atoms/button"]')).not.toBeNull();
  });

  it('opens the command palette from the hero ghost button', () => {
    const open = jest.spyOn(palette, 'open');
    const buttons = fixture.nativeElement.querySelectorAll('.bento__ghost');
    expect(buttons.length).toBe(1);
    (buttons[0] as HTMLButtonElement).click();
    expect(open).toHaveBeenCalled();
  });
});