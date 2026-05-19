import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TarjetaTareaComponent } from './tarjeta-tarea.component';
import { SharedModule } from '../../shared.module';
import { Tarea } from '../../../core/models/domain.models';

describe('TarjetaTareaComponent', () => {
  let component: TarjetaTareaComponent;
  let fixture: ComponentFixture<TarjetaTareaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TarjetaTareaComponent);
    component = fixture.componentInstance;
  });

  it('renders assigned member names when present', () => {
    component.tarea = {
      id: 'tarea-1',
      hogarCodigo: 'CASA1234',
      titulo: 'Comprar pienso',
      prioridad: { codigo: 'ALTA', label: 'Alta' },
      esPeriodica: false,
      esPersonal: false,
      estado: { codigo: 'ACTIVA', label: 'Activa' },
      asignaciones: [
        { id: 'asg-1', miembroId: 'm1', nombreMiembro: 'Ana' },
        { id: 'asg-2', miembroId: 'm2', nombreMiembro: 'Luis' },
      ],
    } as Tarea;

    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Ana, Luis');
    expect(component.nombresAsignados).toEqual(['Ana', 'Luis']);
  });

  it('renders due date with a visible time when fechaLimite is present', () => {
    component.tarea = {
      id: 'tarea-2',
      hogarCodigo: 'CASA1234',
      titulo: 'Lavar ropa',
      prioridad: { codigo: 'MEDIA', label: 'Media' },
      fechaLimite: '2026-05-20T18:30:00Z',
      esPeriodica: false,
      esPersonal: false,
      estado: { codigo: 'ACTIVA', label: 'Activa' },
    } as Tarea;

    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('20/05/2026');
    expect(text).toMatch(/\d{2}:\d{2}/);
  });
});
