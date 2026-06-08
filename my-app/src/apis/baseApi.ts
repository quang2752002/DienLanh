import api from '@/lib/axios';

export class BaseApiService<T, TCreate = any, TUpdate = any> {
  protected endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  getAll = async (): Promise<T[]> => {
    const response = await api.get<T[]>(this.endpoint);
    return response.data;
  };

  getById = async (id: string): Promise<T> => {
    const response = await api.get<T>(`${this.endpoint}/${id}`);
    return response.data;
  };

  create = async (input: TCreate): Promise<T> => {
    const response = await api.post<T>(this.endpoint, input);
    return response.data;
  };

  update = async (id: string, input: TUpdate): Promise<T> => {
    const response = await api.put<T>(`${this.endpoint}/${id}`, input);
    return response.data;
  };

  delete = async (id: string): Promise<void> => {
    await api.delete(`${this.endpoint}/${id}`);
  };
}
