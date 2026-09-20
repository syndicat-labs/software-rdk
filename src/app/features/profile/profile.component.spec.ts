import { render, screen, fireEvent } from '@testing-library/angular';
import { ProfileComponent } from './profile.component';
import { AuthStore } from '../../core/auth/auth.store';

describe('ProfileComponent', () => {
  it('renders a placeholder identity without a session', async () => {
    await render(ProfileComponent, { providers: [{ provide: AuthStore }] });
    expect(screen.getAllByText('—')).toHaveLength(3);
  });

  it('renders the user id and role from the store', async () => {
    const store = new AuthStore();
    store.setUser({ id: 'u-42', roles: ['admin'] });
    await render(ProfileComponent, { providers: [{ provide: AuthStore, useValue: store }] });
    expect(screen.getAllByText('u-42')).toHaveLength(2);
    expect(screen.getByText('admin')).toBeInTheDocument();
  });

  it('ignores a submit while the form is invalid', async () => {
    await render(ProfileComponent, { providers: [{ provide: AuthStore }] });
    fireEvent.click(screen.getByRole('button', { name: 'Update password' }));
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('confirms the password update once the form is valid', async () => {
    const { container } = await render(ProfileComponent, { providers: [{ provide: AuthStore }] });
    const password = container.querySelector<HTMLInputElement>('input#profile-password');
    const confirm = container.querySelector<HTMLInputElement>('input#profile-confirm');
    expect(password).not.toBeNull();
    expect(confirm).not.toBeNull();
    fireEvent.input(password as HTMLInputElement, { target: { value: 'Str0ng!Pass#123' } });
    fireEvent.input(confirm as HTMLInputElement, { target: { value: 'Str0ng!Pass#123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Update password' }));
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});