import {
  Directive,
  effect,
  inject,
  Input,
  OnDestroy,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { AuthStore } from '../../core/auth/auth.store';

@Directive({ selector: '[rdkHasPermission]', standalone: true })
export class HasPermissionDirective implements OnDestroy {
  private readonly store = inject(AuthStore);
  private readonly templateRef = inject(TemplateRef<unknown>);
  private readonly viewContainer = inject(ViewContainerRef);

  private requiredRoles: string[] = [];
  private requireAll = false;
  private hasView = false;

  private readonly effectRef = effect(() => {
    this.store.roles();
    this.updateView();
  });

  @Input() set rdkHasPermission(roles: string | string[]) {
    this.requiredRoles = Array.isArray(roles) ? roles : [roles];
    this.updateView();
  }

  @Input() set rdkHasPermissionAll(requireAll: boolean) {
    this.requireAll = requireAll;
    this.updateView();
  }

  ngOnDestroy(): void {
    this.effectRef.destroy();
  }

  private updateView(): void {
    const permitted = this.checkPermission();
    if (permitted && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!permitted && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }

  private checkPermission(): boolean {
    if (!this.store.isAuthenticated()) {
      return false;
    }
    if (this.requiredRoles.length === 0) {
      return true;
    }
    if (this.requireAll) {
      return this.requiredRoles.every((r) => this.store.hasRole(r));
    }
    return this.requiredRoles.some((r) => this.store.hasRole(r));
  }
}
