import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { environment } from '../../environment/environment';

describe('ApiService', () => {
  let service: ApiService;
  let httpTestingController: HttpTestingController;
  const baseUrl = environment.clientsEndpoint;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService],
    });
    service = TestBed.inject(ApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should perform GET request with correct URL when queryParams are provided', () => {
    const queryParams = 'param1=value1&param2=value2';
    const expectedUrl = `${baseUrl}?${queryParams}`;
    const mockResponse = { data: 'test data' };

    service.get(queryParams).subscribe((data: unknown) => {
      expect(data).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(expectedUrl);

    expect(req.request.method).toEqual('GET');
    req.flush(mockResponse);
  });

  it('should handle HTTP errors using handleHttpError', () => {
    const queryParams = 'param1=value1';
    const expectedUrl = `${baseUrl}?${queryParams}`;

    service.get(queryParams).subscribe({
      next: () => fail('Expected an error, but got data'),
      error: (error) => {
        expect(error).toContain('Http failure response for');
        expect(error).toContain(expectedUrl);
      },
    });
    const req = httpTestingController.expectOne(expectedUrl);

    expect(req.request.method).toEqual('GET');
    req.error(new ErrorEvent('Network error'));
  });
});
