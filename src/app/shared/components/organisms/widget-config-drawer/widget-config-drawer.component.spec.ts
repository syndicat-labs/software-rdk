import { render, screen, fireEvent } from '@testing-library/angular';
import { WidgetConfigDrawerComponent } from './widget-config-drawer.component';

describe('WidgetConfigDrawerComponent', () => {
  it('renders when visible', async () => {
    await render(WidgetConfigDrawerComponent, { inputs: { visible: true, widgetTitle: 'Revenue', initialTitle: 'Revenue' } });
    expect(screen.getByTestId('config-drawer')).toBeInTheDocument();
  });

  it('hides when not visible', async () => {
    await render(WidgetConfigDrawerComponent, { inputs: { visible: false, widgetTitle: 'Revenue', initialTitle: 'Revenue' } });
    expect(screen.queryByTestId('config-drawer')).toBeNull();
  });

  it('emits closed on overlay and cancel', async () => {
    const { fixture } = await render(WidgetConfigDrawerComponent, { inputs: { visible: true, widgetTitle: 'Revenue', initialTitle: 'Revenue' } });
    const spy = jest.spyOn(fixture.componentInstance.closed, 'emit');
    fireEvent.click(screen.getByTestId('config-overlay'));
    expect(spy).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('validates title and emits save', async () => {
    const { fixture } = await render(WidgetConfigDrawerComponent, { inputs: { visible: true, widgetTitle: 'Revenue', initialTitle: 'Revenue' } });
    const saveSpy = jest.spyOn(fixture.componentInstance.save, 'emit');
    const input = document.getElementById('config-title') as HTMLInputElement;
    expect(input).not.toBeNull();
    fireEvent.input(input, { target: { value: '' } });
    fireEvent.blur(input);
    fixture.detectChanges();
    const saveBtn = screen.getByRole('button', { name: 'Save' });
    expect(saveBtn.hasAttribute('disabled') || saveBtn.getAttribute('aria-disabled') === 'true').toBe(true);
    fireEvent.input(input, { target: { value: 'New Title' } });
    fireEvent.blur(input);
    fixture.detectChanges();
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(saveSpy).toHaveBeenCalledWith({ title: 'New Title' });
  });
});
