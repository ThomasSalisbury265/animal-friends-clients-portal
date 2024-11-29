import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { ClientsService } from '../clients.service';
import { of } from 'rxjs';
import { ClientDashboard } from '../../../../shared/models/ui/client-dashboard.interface';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ClientCardComponent } from '../../../../shared/components/client-card.component';
import { CommonModule } from '@angular/common';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let clientsServiceSpy: jasmine.SpyObj<ClientsService>;

  const mockClients: ClientDashboard[] = [
    {
      id: '1',
      name: { title: 'Mr', first: 'John', last: 'Doe' },
      email: 'john.doe@example.com',
      username: 'johndoe',
      country: 'USA',
      picture: 'http://example.com/johndoe.jpg',
    },
    {
      id: '2',
      name: { title: 'Mrs', first: 'Jane', last: 'Smith' },
      email: 'jane.smith@example.com',
      username: 'janesmith',
      country: 'Canada',
      picture: 'http://example.com/janesmith.jpg',
    },
  ];
  beforeEach(async () => {

    clientsServiceSpy = jasmine.createSpyObj('ClientsService', ['loadMoreClients'], {
      dashboardClients$: of(mockClients),
    });

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterTestingModule,
        DashboardComponent,
        ClientCardComponent,
      ],
      providers: [
        { provide: ClientsService, useValue: clientsServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load clients on init', (done) => {
    component.clients$?.subscribe((clients) => {
      expect(clients.length).toBe(2);
      expect(clients).toEqual(jasmine.arrayContaining(mockClients));
      done();
    });
  });

  it('should filter clients based on search input', fakeAsync(() => {
    let clientsResult: ClientDashboard[] = [];

    component.filteredClients$.subscribe((clients) => {
      clientsResult = clients;
    });
    tick();
    fixture.detectChanges();

    expect(clientsResult.length).toBe(2);
    component.searchControl.setValue('Jane');

    tick(500);
    fixture.detectChanges();

    expect(clientsResult.length).toBe(1);
    expect(clientsResult[0].name.first).toBe('Jane');
  }));

});
