import { TestBed } from '@angular/core/testing';
import { ClientsService } from './clients.service';
import { ApiService } from '../../../core/services/api.service';
import { of } from 'rxjs';
import { ClientResponse, Client } from '../../../shared/models/api/client-response.interface';

describe('ClientsService', () => {
  let service: ClientsService;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('ApiService', ['get']);

    TestBed.configureTestingModule({
      providers: [
        ClientsService,
        { provide: ApiService, useValue: spy },
      ],
    });
    service = TestBed.inject(ClientsService);
    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve clients and update dashboardClients when getClients is called', (done) => {
    const mockClient: Client = {
      gender: 'male',
      name: { title: 'Mr', first: 'Test', last: 'User' },
      location: {
        street: { number: 123, name: 'Main Street' },
        city: 'Preston',
        state: 'Anystate',
        country: 'UK',
        postcode: 12345,
        coordinates: { latitude: '0', longitude: '0' },
        timezone: { offset: '00:00', description: 'GMT' },
      },
      email: 'test.user@testemail.com',
      login: {
        uuid: 'uuid-1-2-3-4',
        username: 'testUser',
        password: 'password',
        salt: 'salt',
        md5: 'md5',
        sha1: 'sha1',
        sha256: 'sha256',
      },
      dob: { date: '1980-01-01T00:00:00Z', age: 40 },
      registered: { date: '2010-01-01T00:00:00Z', age: 10 },
      phone: '071234567',
      cell: '07986429864',
      id: { name: 'SSN', value: '123-45-6789' },
      picture: {
        large: 'large.jpg',
        medium: 'medium.jpg',
        thumbnail: 'thumbnail.jpg',
      },
      nat: 'UK',
    };
    const mockResponse: ClientResponse = {
      results: [mockClient],
      info: { seed: 'abc', results: 1, page: 1, version: '1.0' },
    };
    apiServiceSpy.get.and.returnValue(of(mockResponse));

    service.getClients(1, 1).subscribe(() => {
      expect(apiServiceSpy.get).toHaveBeenCalledWith('results=1&page=1');
      service.dashboardClients$.subscribe((clients) => {
        expect(clients.length).toBe(1);
        expect(clients[0].id).toBe('uuid-1-2-3-4');
        expect(clients[0].name.first).toBe('Test');
        done();
      });
    });
  });

  it('should return ClientDetails when getClientDetails is called with a valid ID', (done) => {
    const mockClient: Client = {
      gender: 'female',
      name: { title: 'Ms', first: 'Random', last: 'User' },
      location: {
        street: { number: 123, name: 'Second Street' },
        city: 'Lancaster',
        state: 'Otherstate',
        country: 'UK',
        postcode: 112343,
        coordinates: { latitude: '0', longitude: '0' },
        timezone: { offset: '00:00', description: 'GMT' },
      },
      email: 'random-user@example.com',
      login: {
        uuid: 'uuid-2-3-4-5',
        username: 'random-user-12',
        password: 'password',
        salt: 'salt',
        md5: 'md5',
        sha1: 'sha1',
        sha256: 'sha256',
      },
      dob: { date: '1990-01-01T00:00:00Z', age: 30 },
      registered: { date: '2015-01-01T00:00:00Z', age: 5 },
      phone: '0252543840873',
      cell: '0746836864',
      id: { name: 'SSN', value: '987-65-4321' },
      picture: {
        large: 'large2.jpg',
        medium: 'medium2.jpg',
        thumbnail: 'thumbnail2.jpg',
      },
      nat: 'UK',
    };
    (service as any).clientsMap.set('uuid-2-3-4-5', mockClient);

    service.getClientDetails('uuid-2-3-4-5').subscribe((clientDetails) => {
      expect(clientDetails).toBeDefined();
      expect(clientDetails?.id).toBe('uuid-2-3-4-5');
      expect(clientDetails?.name.first).toBe('Random');
      expect(clientDetails?.email).toBe('random-user@example.com');
      done();
    });
  });

  it('should not call ApiService.get() when getClients is called for a page that is already loaded', (done) => {
    (service as any).loadedPages.add(1);

    service.getClients(1, 1).subscribe({
      next: () => {
      },
      error: (err) => {
        fail('Expected observable to complete without errors');
        done();
      },
      complete: () => {
        expect(apiServiceSpy.get).not.toHaveBeenCalled();
        done();
      },
    });
  });
});
