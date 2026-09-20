import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ShowcaseBlockActionsComponent } from './showcase-block-actions.component';
import { CommandRecentsService } from '../../../core/command-palette/command-recents.service';
import { APP_CONFIG } from '../../../core/config/app-config.token';
import { DEFAULT_AUTH_CONFIG } from '../../../core/config/app-config.model';

const TEST_CONFIG = {
  environment: { production: false, apiBaseUrl: '', authBaseUrl: '', logLevel: 'error' as const },
  api: { baseUrl: 'http://localhost:3000/api', timeoutMs: 1000, maxRetries: 0 },
  auth: DEFAULT_AUTH_CONFIG,
  features: {},
};

describe('ShowcaseBlockActionsComponent', () => {
  let fixture: ComponentFixture<ShowcaseBlockActionsComponent>;
  let recents: CommandRecentsService;
  const clipboard: { text: string; writeText: (t: string) => void } = {
    text: '',
    writeText: (t: string) => {
      clipboard.text = t;
    },
  };

  beforeEach(() => {
    localStorage.clear();
    Object.defineProperty(navigator, 'clipboard', {
      value: clipboard,
      configurable: true,
    });
    TestBed.configureTestingModule({
      imports: [ShowcaseBlockActionsComponent],
      providers: [
        { provide: APP_CONFIG, useValue: TEST_CONFIG },
        // Route shape mirrors the app: the fork action returns to the app home.
        provideRouter([
          { path: 'app/dashboard', component: class {} },
          { path: 'showcase/atoms/:block', component: class {} },
        ]),
      ],
    });
    fixture = TestBed.createComponent(ShowcaseBlockActionsComponent);
    fixture.componentRef.setInput('blockLabel', 'Button');
    fixture.detectChanges();
    recents = TestBed.inject(CommandRecentsService);
  });

  afterEach(() => {
    localStorage.clear();
    clipboard.text = '';
    (clipboard as { writeText: (t: string) => void }).writeText = (t: string) => {
      clipboard.text = t;
    };
    // jsdom has no clipboard by default; drop the override so other tests
    // see their own pristine environment.
    Object.defineProperty(navigator, 'clipboard', { value: undefined, configurable: true });
  });

  it('renders the block id and the install command', () => {
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Button');
    expect(text).toContain('npx rdk add @rdk/block');
  });

  it('copies the install command to the clipboard', async () => {
    const buttons = fixture.nativeElement.querySelectorAll('button');
    const copy = [...buttons].find((b) => b.textContent?.includes('Copy'));
    expect(copy).toBeDefined();
    copy!.click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(clipboard.text).toBe('npx rdk add @rdk/block');
    expect(fixture.nativeElement.textContent).toContain('Copied');
  });

  it('forks the block into recents and returns to Home', () => {
    const buttons = fixture.nativeElement.querySelectorAll('button');
    const fork = [...buttons].find((b) => b.textContent?.includes('Fork'));
    fork!.click();
    fixture.detectChanges();
    expect(recents.list()).toHaveLength(1);
    expect(recents.list()[0].label).toBe('Button block');
  });
});