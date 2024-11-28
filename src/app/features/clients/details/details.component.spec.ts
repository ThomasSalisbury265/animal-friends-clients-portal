import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailsComponent } from './details.component';
import { ClientsService } from '../clients.service';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { ClientDetails } from '../../../../shared/models/ui/client-details.interface';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

describe('DetailsComponent', () => {
  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;
  let clientsServiceSpy: jasmine.SpyObj<ClientsService>;
  let activatedRouteStub: Partial<ActivatedRoute>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const mockClientDetails: ClientDetails = {
      id: '123',
      name: { title: 'Mr', first: 'John', last: 'Doe' },
      email: 'john.doe@example.com',
      username: 'johndoe',
      country: 'USA',
      city: 'New York',
      state: 'NY',
      dateOfBirth: '01/01/1990',
      registered: '01/01/2020',
      phone: '555-1234',
      picture: 'http://example.com/johndoe.jpg',
    };

    clientsServiceSpy = jasmine.createSpyObj('ClientsService', ['getClientDetails']);
    clientsServiceSpy.getClientDetails.and.returnValue(of(mockClientDetails));

    activatedRouteStub = {
      paramMap: of(convertToParamMap({ id: '123' })),
    };

    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        DetailsComponent,
        RouterModule,
      ],
      providers: [
        { provide: ClientsService, useValue: clientsServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should retrieve client details on init', () => {
    expect(clientsServiceSpy.getClientDetails).toHaveBeenCalledWith('123');
    component.client$.subscribe((client) => {
      expect(client).toEqual(jasmine.objectContaining({ id: '123' }));
    });
  });

  it('should navigate back to dashboard when navigateBack is called', () => {
    component.navigateBack();
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('');
  });
});
