import { render, screen, fireEvent } from '@testing-library/angular';
import { ThemeToggleComponent } from './theme-toggle.component';
import { ThemeService } from '../../../../core/theme/theme.service';
import { THEME_REGISTRY } from '../../../../core/theme/token-contract';

const STORAGE_KEY = 'rdk_theme';

describe('ThemeToggleComponent', () => {
  afterEach(() => {
    localStorage.clear();
  });

  it('offers one option per registered language', async () => {
    await render(ThemeToggleComponent);
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(THEME_REGISTRY.length);
    for (const theme of THEME_REGISTRY) {
      expect(screen.getByRole('option', { name: theme.label })).toBeInTheDocument();
    }
  });

  it('reflects the service as the selected value', async () => {
    const { fixture } = await render(ThemeToggleComponent);
    const service = fixture.debugElement.injector.get(ThemeService);
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe(service.current());
  });

  it('applies the chosen language to the service', async () => {
    const { fixture } = await render(ThemeToggleComponent);
    const service = fixture.debugElement.injector.get(ThemeService);
    // Pick a language other than the active one so the assertion is meaningful.
    const target = THEME_REGISTRY.find((t) => t.id !== service.current())!;

    const select = screen.getByRole('combobox') as HTMLSelectElement;
    fireEvent.change(select, { target: { value: target.id } });

    expect(service.current()).toBe(target.id);
    expect(document.documentElement.getAttribute('data-theme')).toBe(target.id);
  });

  it('ignores a value absent from the registry', async () => {
    // A select cannot normally emit an unlisted value, but the handler is the
    // boundary that keeps a non-ThemeId out of the service — so it is tested
    // directly rather than assumed unreachable.
    const { fixture } = await render(ThemeToggleComponent);
    const service = fixture.debugElement.injector.get(ThemeService);
    const before = service.current();

    const select = screen.getByRole('combobox') as HTMLSelectElement;
    const rogue = document.createElement('option');
    rogue.value = 'not-a-registered-language';
    select.appendChild(rogue);
    fireEvent.change(select, { target: { value: 'not-a-registered-language' } });

    expect(service.current()).toBe(before);
    expect(localStorage.getItem(STORAGE_KEY)).not.toBe('not-a-registered-language');
  });

  it('renders the on-dark variant when asked', async () => {
    // `inputs`, not `componentProperties`: the latter assigns over the signal
    // input's function and the template then calls a boolean.
    await render(ThemeToggleComponent, { inputs: { dark: true } });
    expect(document.querySelector('.theme-select--on-dark')).toBeInTheDocument();
  });

  it('renders the default variant otherwise', async () => {
    await render(ThemeToggleComponent);
    expect(document.querySelector('.theme-select--on-dark')).not.toBeInTheDocument();
  });
});
