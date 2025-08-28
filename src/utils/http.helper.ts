import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosRequestConfig } from 'axios';


export async function safeRequest<T>(
  httpService: HttpService,
  method: 'get' | 'post' | 'put' | 'delete',
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> {
  try {
    const response$ = httpService.request<T>({ url, method, ...config });
    const response = await firstValueFrom(response$);
    return response.data;
  } catch (err) {
    // 공통 에러 로깅
    if (err.isAxiosError) {
      console.error('Axios error:', err.message);
      console.error('Error config:', err.config);
      console.error('Error response:', err.response?.data);
    } else {
      console.error('Unknown error:', err);
    }
    throw ""; // 필요 시 커스텀 에러로 변환
    
  }
}