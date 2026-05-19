import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BadgePrioridadComponent } from './badge-prioridad.component';
import { SharedModule } from '../../shared.module';

describe('BadgePrioridadComponent', () => {
  let component: BadgePrioridadComponent;
  let fixture: ComponentFixture<BadgePrioridadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [BadgePrioridadComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BadgePrioridadComponent);
    component = fixture.componentInstance;
  });

  it('renders label and color by prioridad codigo', () => {
    component.prioridadCodigo = 'ALTA';
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Alta');
    expect(component.cfg.color).toBe('danger');
  });
});

