import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosRequestConfig } from 'axios';
import { config } from 'dotenv';
import { HttpException, HttpStatus } from '@nestjs/common';

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
    throw new HttpException(
      `외부 API 호출 실패: ${err.message}`,
      HttpStatus.BAD_GATEWAY,
    );
  }
}

export async function requestFastApi<T>(
  httpService: HttpService,
  method: 'get' | 'post' | 'put' | 'delete',
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> {
    try {
      return await safeRequest(
        httpService,
        method,
        `${process.env.FASTAPI_URL}${url}`,
        config,
  );
    } catch (error) {
      throw new HttpException(
        `외부 API 호출 실패: ${error.message}`,
        HttpStatus.BAD_GATEWAY,
      );
    }
}

